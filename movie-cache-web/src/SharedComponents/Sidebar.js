// import { Link } from "react-router-dom";

const Sidebar = () => {

    return (
        <div className="toolbar">
            {/* <div className="toolbar-item" onClick={this.toggleMovieDisplay}> */}
            <div className="toolbar-item">
                <span className="toolbar-item-button glyphicon glyphicon-plus-sign"></span>
                <span className="toolbar-item-text">Add Movie</span>
            </div>

            {/* <div className="toolbar-item" onClick={this.displayTheRankedList}> */}
            <div className="toolbar-item">
                <span className="toolbar-item-button glyphicon glyphicon-star"></span>
                <span className="toolbar-item-text">Favorites</span>
            </div>

            {/* <div className="toolbar-item" onClick={this.displayTheWatchlist}> */}
            <div className="toolbar-item">
                <span className="toolbar-item-button glyphicon glyphicon-time"></span>
                <span className="toolbar-item-text">Watch list</span>
            </div>

            {/* <div className="toolbar-item" onClick={this.showAbout}> */}
            <div className="toolbar-item">
                <span className="toolbar-item-button glyphicon glyphicon-question-sign"></span>
                <span className="toolbar-item-text">Help</span>
            </div>
        </div>
    )
}

export default Sidebar;