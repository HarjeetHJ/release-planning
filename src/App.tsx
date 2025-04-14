import React from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import type { EventDropArg } from '@fullcalendar/core';
import { ReleaseModal } from './components/ReleaseModal';
import type { Release } from './types';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [releases, setReleases] = React.useState<Release[]>([]);
  const [selectedRelease, setSelectedRelease] = React.useState<Partial<Release>>({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
  const [isLoading, setIsLoading] = React.useState(true);
  const calendarRef = React.useRef<FullCalendar>(null);

  // Sort releases by status (Cancelled first), then priority and date
  const sortedReleases = React.useMemo(() => {
    return [...releases].sort((a, b) => {
      // First sort by cancelled status
      if (a.status === 'Cancelled' && b.status !== 'Cancelled') return -1;
      if (a.status !== 'Cancelled' && b.status === 'Cancelled') return 1;
      
      // Then sort by priority (High > Medium > Low)
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      const aPriority = a.priority || 'Medium';
      const bPriority = b.priority || 'Medium';
      const priorityComparison = priorityOrder[aPriority] - priorityOrder[bPriority];
      
      if (priorityComparison !== 0) return priorityComparison;
      
      // Then by date
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      if (aDate !== bDate) return aDate - bDate;
      
      // If dates are equal, sort by project name
      return a.project.localeCompare(b.project);
    });
  }, [releases]);

  const events = sortedReleases.map((release) => ({
    id: release.id,
    title: `${release.project} ${release.title}`,
    start: release.date,
    allDay: true,
    backgroundColor: getStatusColor(release.status),
    borderColor: getStatusColor(release.status),
    textColor: '#ffffff',
    extendedProps: {
      ...release
    },
    display: 'block',
    order: release.status === 'Cancelled' ? -1 : (release.priority === 'High' ? 0 : release.priority === 'Medium' ? 1 : 2)
  }));

  // Fetch releases on component mount
  React.useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Release[]>(`${API_URL}/data`);
      // If the database is empty, initialize it with the static data
      if (response.data.length === 0) {
        const { initialReleases } = await import('./data');
        await axios.post(`${API_URL}/data`, [...initialReleases]);
        setReleases([...initialReleases]);
      } else {
        setReleases(response.data);
      }
    } catch (error) {
      console.error('Error fetching releases:', error);
      toast.error('Failed to load releases');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const { event } = dropInfo;
    const updatedReleases = releases.map((release) =>
      release.id === event.id
        ? { 
            ...release, 
            date: event.startStr.split('T')[0],
            priority: release.priority || 'Medium' // Ensure priority is set
          }
        : release
    );
    
    try {
      await axios.post(`${API_URL}/data`, updatedReleases);
      setReleases(updatedReleases);
      toast.success('Release date updated successfully');
    } catch (error) {
      console.error('Error updating release date:', error);
      toast.error('Failed to update release date');
      // Revert the calendar to its previous state
      dropInfo.revert();
    }
  };

  const handleEventClick = (info: { event: any }) => {
    const release = releases.find((r) => r.id === info.event.id);
    if (release) {
      setSelectedRelease({ ...release });
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleSaveRelease = async (release: Release) => {
    try {
      let updatedReleases: Release[];
      
      if (modalMode === 'create') {
        const newRelease = {
          ...release,
          id: String(Math.max(...releases.map(r => Number(r.id)), 0) + 1),
          priority: release.priority || 'Medium' // Set default priority
        };
        updatedReleases = [...releases, newRelease];
      } else {
        updatedReleases = releases.map((r) =>
          r.id === release.id ? { ...release, priority: release.priority || r.priority || 'Medium' } : r
        );
      }

      await axios.post(`${API_URL}/data`, updatedReleases);
      setReleases(updatedReleases);
      toast.success(modalMode === 'create' ? 'Release created successfully' : 'Release updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving release:', error);
      toast.error(modalMode === 'create' ? 'Failed to create release' : 'Failed to update release');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading releases...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="h-full w-full">
        <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const calendar = calendarRef.current;
                  calendar?.prev();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => {
                  const calendar = calendarRef.current;
                  calendar?.next();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => {
                  const calendar = calendarRef.current;
                  calendar?.today();
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Today
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => {
                    const calendar = calendarRef.current;
                    calendar?.changeView('dayGridMonth');
                  }}
                  className="px-3 py-1 text-sm hover:bg-gray-50 rounded-l-md border-r border-gray-300"
                >
                  Month
                </button>
                <button
                  onClick={() => {
                    const calendar = calendarRef.current;
                    calendar?.changeView('timeGridWeek');
                  }}
                  className="px-3 py-1 text-sm hover:bg-gray-50 rounded-r-md"
                >
                  Week
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedRelease({});
                  setModalMode('create');
                  setIsModalOpen(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={20} className="mr-2" />
                New Release
              </button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate="2025-04-01"
              editable={true}
              events={events}
              eventDrop={handleEventDrop}
              eventClick={handleEventClick}
              height="100%"
              displayEventEnd={false}
              eventOrder="order"
              headerToolbar={false}
              dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true }}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              eventContent={(eventInfo) => {
                const release = eventInfo.event.extendedProps as Release;
                const priorityColors = {
                  High: 'bg-red-500',
                  Medium: 'bg-yellow-500',
                  Low: 'bg-green-500'
                };

                return (
                  <div className="p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                    <div className="font-semibold break-words whitespace-normal">{eventInfo.event.title}</div>
                    <div className="text-sm flex items-center gap-1 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-black bg-opacity-20 text-white text-xs backdrop-blur-sm">
                        {release.em}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-white text-xs ${priorityColors[release.priority || 'Medium']}`}>
                        {release.priority || 'Medium'}
                      </span>
                      {release.isLastWeek && ' ⚠️'}
                    </div>
                    {release.repo && (
                      <ul className="mt-1 text-xs text-white list-disc ml-3 space-y-0.5 break-words opacity-90">
                        {release.repo.split(', ').map((repo: string, index: number) => (
                          <li key={index} className="whitespace-normal -ml-2">{repo}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>

      <ReleaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        release={selectedRelease}
        onSave={handleSaveRelease}
        mode={modalMode}
      />

      <Toaster position="top-right" />
    </div>
  );
}

function getStatusColor(status: Release['status']) {
  switch (status) {
    case 'Done':
      return '#10B981'; // Green
    case 'On Track':
      return '#3B82F6'; // Blue
    case 'At Risk':
      return '#EF4444'; // Red
    case 'Cancelled':
      return '#6B7280'; // Grey
    default:
      return '#6B7280'; // Gray as fallback
  }
}

export default App;