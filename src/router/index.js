export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: DashboardView, name: 'dashboard' },
    ]
})