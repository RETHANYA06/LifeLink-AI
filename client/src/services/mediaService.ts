import axios from 'axios';

const API_URL = 'http://localhost:5000/api/media';

export const uploadMedia = async (file: File, folder: string = 'media') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = localStorage.getItem('token');

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    });

    return response.data;
};

export const deleteMedia = async (key: string) => {
    const token = localStorage.getItem('token');

    const response = await axios.delete(`${API_URL}/delete`, {
        data: { key },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
};
