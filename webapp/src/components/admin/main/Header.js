import { Link } from "react-router-dom";
import "../../../styles/page/main.scss";
import { formatDate } from "../../helper/date";

const Header = () => {
  const formattedDate = formatDate();
  return (
    <div className='top-section'>
      <div className='top-section__message-container'>
        <div className='top-section__message-container__welcome-message'>
          Welcome to Game Dashboard!
        </div>
        <div className='top-section__message-container__date'>
          {formattedDate}
        </div>
      </div>
      <div className='top-section__top-buttons'>
        <Link
          to='/create'
          className='top-section__top-buttons__top-button__new-game'>
          NEW GAME
        </Link>
        <Link to='/list' className='top-section__top-buttons__top-button'>
          DUPLICATE GAMES
        </Link>
      </div>
    </div>
  );
};

export default Header;
