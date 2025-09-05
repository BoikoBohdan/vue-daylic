<script setup lang="ts">
// Home component logic can be added here
</script>

<template>
  <div class="home-container">
    <div class="home-header">
      <h1 class="home-title">Welcome to Daily Status</h1>
      <p class="home-subtitle">Track your daily progress and stay organized</p>
    </div>

    <div class="home-content">
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Track Progress</h3>
          <p>Monitor your daily activities and see your progress over time</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📈</div>
          <h3>Analytics</h3>
          <p>Get insights into your productivity patterns and trends</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Set Goals</h3>
          <p>Define clear objectives and track your achievement</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3>Stay Organized</h3>
          <p>Keep your tasks and schedules in one place</p>
        </div>
      </div>

      <div class="cta-section">
        <h2>Ready to get started?</h2>
        <p>Begin tracking your daily status and see the difference it makes</p>
        <button class="btn">Get Started</button>
      </div>
    </div>
  </div>
</template>

<style src="./HomeView.css" scoped></style>
