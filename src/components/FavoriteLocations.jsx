import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMapPin } from 'react-icons/fi';
import { BsHeart } from 'react-icons/bs';

const FavoriteLocations = ({ favorites, onSelectFavorite, onRemoveFavorite }) => {
  if (!favorites || favorites.length === 0) return null;

  return (
    <motion.div
      className="favorite-locations glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <h3 className="section-title">
        <BsHeart className="title-icon" />
        Saved Places
      </h3>

      <div className="favorites-grid">
        <AnimatePresence>
          {favorites.map((fav) => (
            <motion.div
              key={fav.id}
              className="favorite-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              layout
            >
              <button
                className="favorite-card-content"
                onClick={() => onSelectFavorite(fav)}
              >
                <FiMapPin className="fav-card-icon" />
                <div className="fav-card-info">
                  <span className="fav-card-name">{fav.name}</span>
                  <span className="fav-card-location">
                    {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </button>
              <button
                className="fav-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(fav);
                }}
                title="Remove from favorites"
              >
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FavoriteLocations;
