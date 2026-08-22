import { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { useAlerts } from './hooks/useAlerts';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherStats from './components/WeatherStats';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import SunriseSunset from './components/SunriseSunset';
import FavoriteLocations from './components/FavoriteLocations';
import WeatherMood from './components/WeatherMood';
import WeatherInsights from './components/WeatherInsights';
import ShareCard from './components/ShareCard';
import HealthTips from './components/HealthTips';
import Footer from './components/Footer';
import WeatherBackground from './components/WeatherBackground';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import WelcomeState from './components/WelcomeState';
import {
  AlertBanner,
  AlertCenter,
  AlertButton,
  AlertDetail,
  AlertSettings,
  MonitorButton,
  MonitorStatus,
  AlertRadar,
  AlertNotificationPrompt,
  AlertToast,
} from './components/alerts';
import './App.css';

function App() {
  const {
    weather,
    loading,
    error,
    searchResults,
    searching,
    currentCity,
    favorites,
    theme,
    unit,
    handleSearch,
    selectCity,
    fetchWeatherByCoords,
    useMyLocation,
    toggleFavorite,
    isFavorite,
    toggleUnit,
    changeTheme,
    setError,
    lastUpdated,
    isLive,
    manualRefresh,
  } = useWeather();

  const {
    isMonitoring,
    alerts,
    activeAlert,
    showBanner,
    bannerAlert,
    settings,
    history,
    lastCheck,
    nextCheck,
    notificationPermission,
    showNotificationPrompt,
    showCenter,
    alertSoundEnabled,
    startMonitoring,
    stopMonitoring,
    performCheck,
    requestNotificationPermission,
    updateSettings,
    toggleAlertSound,
    clearHistory,
    dismissBanner,
    setActiveAlert,
    setShowCenter,
    setShowNotificationPrompt,
    getActiveAlerts,
    getHighestSeverity,
  } = useAlerts();

  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [detailAlert, setDetailAlert] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const activeAlertsList = getActiveAlerts();
  const highestSeverity = getHighestSeverity();

  const handleViewDetail = (alert) => {
    setDetailAlert(alert);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailAlert(null);
  };

  return (
    <div className="app">
      {weather && (
        <WeatherBackground
          weatherCode={weather.current.weatherCode}
          isDay={weather.current.isDay}
        />
      )}

      <div className="app-content">
        <Header
          theme={theme}
          unit={unit}
          onThemeChange={changeTheme}
          onToggleUnit={toggleUnit}
          favoritesCount={favorites.length}
        >
          <AlertButton
            onClick={() => setShowCenter(true)}
            activeAlerts={activeAlertsList}
            highestSeverity={highestSeverity}
          />
          <MonitorButton
            isMonitoring={isMonitoring}
            onStart={startMonitoring}
            onStop={stopMonitoring}
            onShowSettings={() => setShowAlertSettings(true)}
          />
        </Header>

        <SearchBar
          onSearch={handleSearch}
          onSelectCity={selectCity}
          onUseMyLocation={useMyLocation}
          searchResults={searchResults}
          searching={searching}
          onSelectFavorite={(fav) => selectCity(fav)}
          favorites={favorites}
        />

        <main className="main-content">
          {showBanner && bannerAlert && (
            <AlertBanner
              alert={bannerAlert}
              show={showBanner}
              onDismiss={dismissBanner}
              onViewDetail={handleViewDetail}
            />
          )}

          {loading && <LoadingSkeleton />}

          {error && !loading && (
            <ErrorState
              message={error}
              onRetry={() => {
                setError(null);
                if (currentCity) {
                  selectCity(currentCity);
                }
              }}
            />
          )}

          {!loading && !error && !weather && (
            <WelcomeState onUseMyLocation={useMyLocation} />
          )}

          {!loading && !error && weather && (
            <div className="dashboard">
              <div className="dashboard-top">
                <CurrentWeather
                  weather={weather}
                  currentCity={currentCity}
                  unit={unit}
                  isFavorite={currentCity ? isFavorite(currentCity.id) : false}
                  onToggleFavorite={toggleFavorite}
                  lastUpdated={lastUpdated}
                  isLive={isLive}
                  onRefresh={manualRefresh}
                />
                <WeatherStats weather={weather} unit={unit} />
              </div>

              <HourlyForecast hourly={weather.hourly} unit={unit} />

              <div className="dashboard-bottom">
                <DailyForecast daily={weather.daily} unit={unit} />
                <div className="dashboard-side">
                  <SunriseSunset daily={weather.daily} />
                  <WeatherMood weather={weather} unit={unit} />
                </div>
              </div>

              <div className="dashboard-features">
                <WeatherInsights weather={weather} unit={unit} />
                <HealthTips weather={weather} />
                <ShareCard weather={weather} currentCity={currentCity} unit={unit} />
              </div>

              {isMonitoring && (
                <div className="alert-panel">
                  <MonitorStatus
                    isMonitoring={isMonitoring}
                    lastCheck={lastCheck}
                    nextCheck={nextCheck}
                  />
                  <AlertRadar
                    alerts={alerts}
                    radius={settings.radius}
                    isMonitoring={isMonitoring}
                  />
                </div>
              )}

              <FavoriteLocations
                favorites={favorites}
                onSelectFavorite={(fav) => selectCity(fav)}
                onRemoveFavorite={toggleFavorite}
              />
            </div>
          )}
        </main>

        <Footer unit={unit} theme={theme} />
      </div>

      {/* Alert Center Panel */}
      <AlertCenter
        show={showCenter}
        onClose={() => {
          setShowCenter(false);
          handleCloseDetail();
        }}
        alerts={alerts}
        history={history}
        onClearHistory={clearHistory}
        onViewDetail={handleViewDetail}
        onShowSettings={() => {
          setShowCenter(false);
          setShowAlertSettings(true);
        }}
        isMonitoring={isMonitoring}
        lastCheck={lastCheck}
        notificationPermission={notificationPermission}
      />

      {/* Alert Detail */}
      <AlertDetail
        alert={detailAlert}
        show={showDetail}
        onClose={handleCloseDetail}
      />

      {/* Alert Settings */}
      <AlertSettings
        show={showAlertSettings}
        onClose={() => setShowAlertSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onToggleSound={toggleAlertSound}
      />

      {/* Alert Toast */}
      {activeAlert && !showBanner && (
        <AlertToast
          alert={activeAlert}
          onDismiss={() => setActiveAlert(null)}
          onViewDetail={handleViewDetail}
        />
      )}

      {/* Notification Prompt */}
      <AlertNotificationPrompt
        show={showNotificationPrompt && isMonitoring && notificationPermission === 'default'}
        onEnable={requestNotificationPermission}
        onDismiss={() => setShowNotificationPrompt(false)}
      />
    </div>
  );
}

export default App;
