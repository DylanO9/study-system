import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

// Attach the JWT to every request automatically.
// Any component that calls api.get/post/etc never has to think about the token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth helpers
export const authAPI = {
  login:    (email, password)             => api.post('/auth/login',    { email, password }),
  register: (name, email, password, goal) => api.post('/auth/register', { name, email, password, goal }),
}

// Exercise library
export const exercisesAPI = {
  list: () => api.get('/exercises'),
}

// Templates
export const templatesAPI = {
  list:   ()           => api.get('/templates'),
  create: (data)       => api.post('/templates', data),
  update: (id, data)   => api.put(`/templates/${id}`, data),
  delete: (id)         => api.delete(`/templates/${id}`),
}

// Workout logs
export const workoutsAPI = {
  list: ()     => api.get('/workouts'),
  save: (data) => api.post('/workouts', data),
  get:  (id)   => api.get(`/workouts/${id}`),
}

export default api
