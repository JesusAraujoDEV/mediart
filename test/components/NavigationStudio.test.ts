import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NavigationStudio from '~/components/navigation/NavigationStudio.vue'

describe('NavigationStudio', () => {
    beforeEach(() => {
        // Reset localStorage mock
        vi.clearAllMocks()
        localStorage.getItem.mockReturnValue(JSON.stringify({
            username: 'testuser',
            id: 1
        }))
    })

    it('renders navigation bar correctly', () => {
        const wrapper = mount(NavigationStudio)

        expect(wrapper.find('nav').exists()).toBe(true)
        expect(wrapper.find('#logoNavbar').exists()).toBe(true)
        expect(wrapper.find('[alt="Profile Preview"]').exists()).toBe(true)
    })

    it('displays logo with correct attributes', () => {
        const wrapper = mount(NavigationStudio)
        const logo = wrapper.find('#logoNavbar')

        expect(logo.attributes('src')).toBe('/mediart/mediartLogo.webp')
        expect(logo.attributes('alt')).toBe('Logo')
    })

    it('shows loading state for profile image', () => {
        const wrapper = mount(NavigationStudio)

        // Initially should show loading state
        expect(wrapper.find('[alt="Cargando perfil..."]').exists()).toBe(true)
    })

    it('has correct navigation links', () => {
        const wrapper = mount(NavigationStudio)

        expect(wrapper.find('a[href="/studio"]').exists()).toBe(true)
        expect(wrapper.find('a[href="/studio/help"]').exists()).toBe(true)
        expect(wrapper.find('a[href="/studio/search"]').exists()).toBe(true)
    })

    it('handles logout correctly', async () => {
        const mockRouter = {
            push: vi.fn()
        }

        const wrapper = mount(NavigationStudio, {
            global: {
                mocks: {
                    $router: mockRouter
                }
            }
        })

        const logoutButton = wrapper.find('[data-testid="logout"]')
        await logoutButton.trigger('click')

        expect(localStorage.removeItem).toHaveBeenCalledWith('token')
        expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })

    it('applies responsive classes correctly', () => {
        const wrapper = mount(NavigationStudio)
        const nav = wrapper.find('nav')

        expect(nav.classes()).toContain('fixed')
        expect(nav.classes()).toContain('top-0')
        expect(nav.classes()).toContain('left-0')
        expect(nav.classes()).toContain('right-0')
        expect(nav.classes()).toContain('md:right-auto')
    })

    it('handles image error correctly', async () => {
        const wrapper = mount(NavigationStudio)
        const img = wrapper.find('[alt="Profile Preview"]')

        await img.trigger('error')

        // Should call handleImageError function
        expect(img.attributes('src')).toBeDefined()
    })
}) 