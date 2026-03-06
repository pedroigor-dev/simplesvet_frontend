<template>
  <aside class="sidebar">
    <div class="sidebar__logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M4.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm15 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 22c-3.5 0-5.8-1.5-7-3.8-.8-1.5-.8-3 .2-4.7.7-1.2 1.8-1.8 3.1-2.1.9-.2 1.8-.4 2.5-.5h2.4c.7.1 1.6.3 2.5.5 1.3.3 2.4.9 3.1 2.1 1 1.7 1 3.2.2 4.7C17.8 20.5 15.5 22 12 22z"/>
        </svg>
      </div>
      <div class="logo-text">
        <span class="logo-brand">PetLove</span>
        <span class="logo-sub">SimplesVet</span>
      </div>
    </div>

    <nav class="sidebar__nav">
      <p class="nav-section">Menu Principal</p>

      <RouterLink to="/dashboard" class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69zM12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"/>
          </svg>
        </span>
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink to="/owners" class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
        </span>
        <span>Tutores</span>
      </RouterLink>

      <RouterLink to="/pets" class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M4.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm15 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 22c-3.5 0-5.8-1.5-7-3.8-.8-1.5-.8-3 .2-4.7.7-1.2 1.8-1.8 3.1-2.1.9-.2 1.8-.4 2.5-.5h2.4c.7.1 1.6.3 2.5.5 1.3.3 2.4.9 3.1 2.1 1 1.7 1 3.2.2 4.7C17.8 20.5 15.5 22 12 22z"/>
          </svg>
        </span>
        <span>Pets</span>
      </RouterLink>

      <RouterLink to="/appointments" class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"/>
          </svg>
        </span>
        <span>Consultas</span>
      </RouterLink>
    </nav>

    <div class="sidebar__user">
      <div class="user-avatar">DR</div>
      <div class="user-info">
        <span class="user-name">Dr. Rafael Lima</span>
        <span class="user-role">Veterinário</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@import '@/assets/styles/app-sidebar.css';
</style>