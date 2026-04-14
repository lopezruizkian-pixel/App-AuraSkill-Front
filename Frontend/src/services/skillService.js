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

export const fetchSkills = async (query = '') => {
  const searchParams = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
  const response = await httpClient.get(`/skills${searchParams}`);
  return Array.isArray(response) ? response.map(normalizeSkill) : [];
};

export const createSkill = async (skillData) => {
  const response = await httpClient.post('/skills', skillData);
  return normalizeSkill(response.skill || response);
};

export const deleteSkill = async (skillId) => {
  return await httpClient.delete(`/skills/${skillId}`);
};
