import React from 'react';
import { X } from 'lucide-react';
import type { Release } from '../types';

interface ReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  release: Partial<Release>;
  onSave: (release: Release) => void;
  mode: 'create' | 'edit';
}

export function ReleaseModal({ isOpen, onClose, release, onSave, mode }: ReleaseModalProps) {
  const [formData, setFormData] = React.useState<Partial<Release>>({
    ...release,
    priority: release.priority || 'Medium' // Ensure priority has a default value
  });

  React.useEffect(() => {
    setFormData({
      ...release,
      priority: release.priority || 'Medium' // Ensure priority has a default value when release changes
    });
  }, [release]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure priority is set before saving
    onSave({
      ...formData as Release,
      priority: formData.priority || 'Medium'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? 'Create New Release' : 'Edit Release'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <input
                type="text"
                value={formData.project || ''}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Engineering Manager</label>
              <input
                type="text"
                value={formData.em || ''}
                onChange={(e) => setFormData({ ...formData, em: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Release Date</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Repository</label>
              <input
                type="text"
                value={formData.repo || ''}
                onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status || 'On Track'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Release['status'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Done">Done</option>
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={formData.priority || 'Medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Release['priority'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={formData.businessCommitment || false}
              onChange={(e) => setFormData({ ...formData, businessCommitment: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Business Commitment</label>
          </div>

          {formData.businessCommitment && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Commitment Date</label>
              <input
                type="text"
                value={formData.businessCommitmentDate || ''}
                onChange={(e) => setFormData({ ...formData, businessCommitmentDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}