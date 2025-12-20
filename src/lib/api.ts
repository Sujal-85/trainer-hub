export const API_BASE_URL = 'https://trainer-hub-yvuj.onrender.com/api';

export const registerTrainer = async (type: 'technical' | 'non-technical', data: any, files: { resume?: File; profilePhoto?: File }) => {
    const formData = new FormData();
    formData.append('type', type);

    // Clone data excluding Files
    const cleanData = { ...data };
    delete cleanData.resume;
    delete cleanData.profilePhoto;

    formData.append('data', JSON.stringify(cleanData));

    if (files.resume) {
        formData.append('resume', files.resume);
    }
    if (files.profilePhoto) {
        formData.append('profilePhoto', files.profilePhoto);
    }

    const response = await fetch(`${API_BASE_URL}/trainers/register`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register trainer');
    }

    return response.json();
};

export const parseResume = async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${API_BASE_URL}/ai/parse-resume`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to parse resume');
    }

    return response.json();
};
export const getTrainers = async () => {
    const response = await fetch(`${API_BASE_URL}/trainers`);
    if (!response.ok) throw new Error('Failed to fetch trainers');
    return response.json();
};

export const updateTrainerStatus = async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/trainers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update trainer status');
    return response.json();
};
