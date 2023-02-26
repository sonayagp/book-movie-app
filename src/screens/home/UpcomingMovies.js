/*
This component displays the upcoming movies in the top side of the page layout
 */

import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    upcomingMoviesHeading: {
        textAlign: 'center',
        background: '#ff9999',
        padding: '8px',
        fontSize: '1rem'
    },
    gridListUpcomingMovies: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        width: '100%'
    },

});

const UpcomingMovies =(props)=> {
    const [upcomingMovies, setUpcomingMovies] =useState([]);
    useEffect(() =>{
        axios.get(props.baseUrl + "movies?status=PUBLISHED&limit=6") 
        .then(res => {
        setUpcomingMovies(res.data.movies)

      });
    },[]);
    const { classes } = props;

    return (
        <div>
        <div className={classes.upcomingMoviesHeading}>
                    <span>Upcoming Movies</span>
                </div>

                <GridList cols={5} className={classes.gridListUpcomingMovies} >
                    {upcomingMovies.map(movie => (
                        <GridListTile key={"upcoming" + movie.id}>
                            <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                            <GridListTileBar title={movie.title} />
                        </GridListTile>
                    ))}
                </GridList>
                </div>
    )
}

export default withStyles(styles)(UpcomingMovies);
