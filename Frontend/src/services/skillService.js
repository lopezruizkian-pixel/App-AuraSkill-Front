import { httpClient } from './httpClient';

const normalizeSkill = (skill) => {
  if (!skill) {
    return skill;
  }

  return {
    ...skill,
    id: skill.id || skill._id,
    _id: skill._id || skill.id,
  };
};

export const fetchSkills = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.append('q', params.q);
  if (params.mentorId) queryParams.append('mentorId', params.mentorId);
  if (params.categoria) queryParams.append('categoria', params.categoria);
  if (params.own) queryParams.append('own', 'true');

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await httpClient.get(`/skills${queryString}`);
  return Array.isArray(response) ? response.map(normalizeSkill) : [];
};

export const fetchMySkills = async () => {
  return await fetchSkills({ own: true });
};

export const assignSkills = async (skillIds) => {
  const response = await httpClient.post('/skills/assign', { skillIds });
  return response;
};

export const createSkill = async (skillData) => {
  const response = await httpClient.post('/skills', skillData);
  return normalizeSkill(response.skill || response);
};

export const deleteSkill = async (skillId) => {
  return await httpClient.delete(`/skills/${skillId}`);
};
