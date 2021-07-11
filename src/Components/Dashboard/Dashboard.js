import React, { Component } from "react";
import { Button, Navbar, Form, FormControl, Nav, Card, 
    OverlayTrigger,Tooltip, InputGroup
} from 'react-bootstrap';
import axios from "axios";
import { CgArrowLongLeft } from "react-icons/cg";

import "./Dashboard.css"

// API 
// https://api.themoviedb.org/3/genre/movie/list?api_key=0b8e689501917128a53fbb4b87fd8830&language=en-US
// https://api.themoviedb.org/3/genre/28/movies?api_key=0b8e689501917128a53fbb4b87fd8830&language=en-US

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:true,
            category_movies: false,
            categoryData:[],
            searchMovieData:[],
            categoryMovieData:[],
            search_movies: false
        };
    }

    componentDidMount(){
        this.getCategoryDeta()
    }

    getCategoryDeta = async () => {
        let headers = {
            "Content-Type": "application/json",
        };
        let url = "https://api.themoviedb.org/3/genre/movie/list?api_key=0b8e689501917128a53fbb4b87fd8830&language=en-US";
        await axios.get(url, {
          headers: headers
        }).then(response => {
          this.setState({ 
            categoryData: response.data.genres,
          });
        });
    }

    // Serch Movies
    performSearch(searchMovie) {
        console.log(searchMovie)
        if(searchMovie === ""){
            this.setState({
                search_movies: false,
                show: true,
                category_movies: false,
            
            })
        }
        let headers = {
            "Content-Type": "application/json",
        };
        let urlString = "https://api.themoviedb.org/3/search/movie?api_key=0b8e689501917128a53fbb4b87fd8830&query=" + searchMovie
        axios.get(urlString, {
          headers: headers
        }).then(response => {
          this.setState({ 
            searchMovieData: response.data.results,
            show: false,
            category_movies: false,
            search_movies: true
          });
        });
    }


    searchChangeHandler(event) {
        console.log(event.target.value)
        const boundObject = this
        const searchMovie = event.target.value
        boundObject.performSearch(searchMovie)
    }

    // GET CATERGORY WISE MOVIE DATA
    getCategoryMovieData(id) {
        
        let headers = {
            "Content-Type": "application/json",
        };
        let urlString = "https://api.themoviedb.org/3/genre/" + id + "/movies?api_key=0b8e689501917128a53fbb4b87fd8830&language=en-US"
        axios.get(urlString, {
          headers: headers
        }).then(response => {
          this.setState({ 
            categoryMovieData: response.data.results,
            show: false,
            category_movies: true
          });
        });
    }

    // GET DETAILS
    getDetailsOfMovie(id) {
        const url = "https://www.themoviedb.org/movie/" + id
        window.location.href = url
    }

    // BACK TO CATEGORY
    getBackToCategory(){
        this.setState({
            category_movies: false,
            show:true
        })
    }

    render(){
        const { categoryData, categoryMovieData, searchMovieData} = this.state;
        return(
            <div className="main">
                <Navbar bg="dark" expand="lg" >
                    <Navbar.Brand href="#home" className="b-name">Pashu Movies</Navbar.Brand>
                </Navbar>

                <div className="container">
                <InputGroup size="lg" className="search-tag">
                    <FormControl className="s-movie" aria-label="Large" type="text" placeholder="Search Movie" onChange={this.searchChangeHandler.bind(this)} aria-describedby="inputGroup-sizing-sm" />
                </InputGroup>

                    {/* CATEGORY  */}

                    {
                        this.state.show?<div className="category-div">
                            <p>Movie Genres</p>
                            {
                                categoryData.map(ele => {
                                    return(
                                        <Card className="main-card" onClick={() => this.getCategoryMovieData(ele.id)}>
                                        
                                            <Card.Body className="c-body">
                                                {ele.name}
                                                    
                                            </Card.Body>
                                            
                                            {/* <Image className="img-css" src={ele.sprite} style={{backgroundColor: ele.cardColors.imgbg}} roundedCircle /> */}
                                        </Card>
                                    )
                                })
                            }
                        </div> : null
                    }
                    
                    {/* CATEGORY MOVIES  */}

                    {
                        this.state.category_movies? <div className="movies">
                            <CgArrowLongLeft className="back-arrow" onClick={() => this.getBackToCategory()} />
                            {
                                categoryMovieData.map(ele =>{
                                    const img_path = "https://image.tmdb.org/t/p/w185" + ele.poster_path;
                                    return(
                                        <Card className="movie-card" style={{ width: '20rem', display: 'inline-block',margin:'20px' }}>
                                            <Card.Img style={{height:'40vh'}} variant="top" src={img_path} />
                                            <Card.Body>
                                                <OverlayTrigger
                                                    // key={placement}
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id={`tooltip-${ele.id}`}>
                                                        {ele.original_title}
                                                        </Tooltip>
                                                    }
                                                    >
                                                    <Card.Title className="m-title">{ele.original_title}</Card.Title>
                                                </OverlayTrigger>

                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id={`tooltip-${ele.id}`}>
                                                            {ele.overview}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Card.Text className="m-overview">
                                                        {ele.overview}
                                                    </Card.Text>
                                                </OverlayTrigger>
                                               
                                                <Button variant="success" onClick={() => this.getDetailsOfMovie(ele.id)}>View</Button>
                                            </Card.Body>
                                        </Card>
                                    )
                                    
                                })
                            }

                            <Button className="bck-btn" onClick={() => this.getBackToCategory()}>Back to Category</Button>
                        </div> : null
                    }
                    
                    {/* SEARCH MOVIES  */}
                    {
                        this.state.search_movies? <div className="movies">
                            <CgArrowLongLeft className="back-arrow"  onClick={() => this.getBackToCategory()} />
                            {
                                searchMovieData.map(ele =>{
                                    const img_path = "https://image.tmdb.org/t/p/w185" + ele.poster_path;
                                    return(
                                        <Card className="movie-card" style={{ width: '20rem', display: 'inline-block',margin:'20px' }}>
                                            <Card.Img style={{height:'40vh'}} variant="top" src={img_path} />
                                            <Card.Body>
                                                <OverlayTrigger
                                                    // key={placement}
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id={`tooltip-${ele.id}`}>
                                                        {ele.original_title}
                                                        </Tooltip>
                                                    }
                                                    >
                                                    <Card.Title className="m-title">{ele.original_title}</Card.Title>
                                                </OverlayTrigger>

                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id={`tooltip-${ele.id}`}>
                                                            {ele.overview}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Card.Text className="m-overview">
                                                        {ele.overview}
                                                    </Card.Text>
                                                </OverlayTrigger>
                                               
                                                <Button variant="success" onClick={() => this.getDetailsOfMovie(ele.id)}>View</Button>
                                            </Card.Body>
                                        </Card>
                                    )
                                    
                                })
                            }

                            {/* <Button variant="success" className="bck-btn" onClick={() => this.getBackToCategory()}>Back to Category</Button> */}
                        </div> : null
                    }
                    
                </div>
            </div>
        )
    }
}

export default Dashboard;