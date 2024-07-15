import { useMutation, useQuery } from '@tanstack/react-query';

import axios from 'axios';

type CategoryData = {
    _id: string;
}

export const { data: ids } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
        try {
            const response = await axios.get<CategoryData[]>(`/api/games`);
            const ids = response.data.map(category => category._id);
            return ids;
        } catch (error) {
            throw new Error('Failed to fetch category data');
        }
    },
});

export const { mutate: submitAnswers } = useMutation<boolean[], Error, { answers: string[], letter: string }>({
    mutationFn: async ({ answers, letter }) => {
        try {
            if (!ids) throw new Error('Category IDs not available');

            const payload = ids.map((id, index) => ({
                categoryId: id,
                answer: answers[index],
            }));

            const response = await axios.post('/api/games/submit', { answers: payload, letter });

            return response.data;
        } catch (error) {
            throw new Error('Failed to submit answers');
        }
    },
    onSuccess: (data) => {
        return data;
    },
    onError: (error) => {
        console.error('Error submitting answers:', error);
    },
});