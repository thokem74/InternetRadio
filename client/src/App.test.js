import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from './App.vue';

vi.mock('./composables/useRadioApi', () => ({
  fetchStations: vi.fn().mockResolvedValue({
    items: [],
    pagination: {
      page: 1,
      limit: 50,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    }
  }),
  fetchFavorites: vi.fn().mockResolvedValue([]),
  addFavoriteStation: vi.fn().mockResolvedValue({}),
  removeFavoriteStation: vi.fn().mockResolvedValue({})
}));

describe('App', () => {
  it('mounts without error', () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });
});
