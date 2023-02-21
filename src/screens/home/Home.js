/**
This component displays the home page with the header at the top followed by the upcoming movies 
in the top row and released movies in the left with spplicable search filters in the right
 */

import React, { useState, useEffect } from 'react';

import './Home.css';
import Header from '../../common/header/Header';
import UpcomingMovies from './UpcomingMovies'
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import ReleasedMovies from './ReleasedMovies';

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
    gridListMain: {
        transform: 'translateZ(0)',
        cursor: 'pointer'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240
    },
    title: {
        color: theme.palette.primary.light,
    }
});

const Home = (props) => {
    const [movieName, setMovieName] = useState("");
    const [releasedMovies, setReleasedMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [artists, setArtists] = useState([]);
    const [genresList, setGenresList] = useState([]);
    const [artistsList, setArtistsList] = useState([]);
    const [releaseDateStart, setReleaseDateStart] = useState("");
    const [releaseDateEnd, setReleaseDateEnd] = useState("");

    useEffect(() => {
        /** Get the released movies as the page loads */
        axios.get(props.baseUrl + "movies?status=RELEASED")
            .then(res => {
                setReleasedMovies(res.data.movies)

            });

        /** Get the genre list to populate the genre filter select menu */
        axios.get(props.baseUrl + "genres")
            .then(res => {
                setGenresList(res.data.genres)

            });

        /** Get the artists list to populate the artists filter select menu */
        axios.get(props.baseUrl + "artists")
            .then(res => {
                setArtistsList(res.data.artists)

            });
    }, []);

    /** The following five handlers set the inputs from the filters */
    const movieNameChangeHandler = event => {
        setMovieName(event.target.value);
    }

    const genreSelectHandler = event => {
        setGenres(event.target.value);
    }

    const artistSelectHandler = event => {
        setArtists(event.target.value)
    }

    const releaseDateStartHandler = event => {
        setReleaseDateStart(event.target.value)
    }

    const releaseDateEndHandler = event => {
        setReleaseDateEnd(event.target.value)

    }

    /** Function to handle the apply filter button click. Builds the query string 
     * from the applied filters and post it using Axios to refine the search and 
     * update the released movies display grid
     */
    const filterApplyHandler = () => {
        let queryString = "?status=RELEASED";
        if (movieName !== "") {
            queryString += "&title=" + movieName;
        }
        if (genres.length > 0) {
            queryString += "&genre=" + genres.toString();
        }
        if (artists.length > 0) {
            queryString += "&artists=" + artists.toString();
        }
        if (releaseDateStart !== "") {
            queryString += "&start_date=" + releaseDateStart;
        }
        if (releaseDateEnd !== "") {
            queryString += "&end_date=" + releaseDateEnd;
        }

        axios.get(props.baseUrl + "movies" + encodeURI(queryString))
            .then(res => {
                setReleasedMovies(res.data.movies)
            });
    }


    const { classes } = props;
    return (
        <div>
            {/** Show the Header */}
            <Header baseUrl={props.baseUrl} />

            {/** Show the Upcoming movies scroll */}
            <UpcomingMovies baseUrl={props.baseUrl} />

            {/** container to hold the released movies grid and the filters card */}
            <div className="flex-container">
                <div className="left">
                    {/** Released movies grid on the left */}
                    <ReleasedMovies baseUrl={props.baseUrl} releasedMovies={releasedMovies} />
                </div>
                <div className="right">
                    {/** Apply Filters card on the right */}
                    <Card>
                        <CardContent>
                            <FormControl className={classes.formControl}>
                                <Typography className={classes.title} color="textSecondary">
                                    FIND MOVIES BY:
                                </Typography>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                                <Input id="movieName" onChange={movieNameChangeHandler} />
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                                <Select
                                    multiple
                                    input={<Input id="select-multiple-checkbox-genre" />}
                                    renderValue={selected => selected.join(',')}
                                    value={genres}
                                    onChange={genreSelectHandler}
                                >
                                    {genresList.map(genre => (
                                        <MenuItem key={genre.id} value={genre.genre}>
                                            <Checkbox checked={genres.indexOf(genre.genre) > -1} />
                                            <ListItemText primary={genre.genre} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="select-multiple-checkbox">Artists</InputLabel>
                                <Select
                                    multiple
                                    input={<Input id="select-multiple-checkbox" />}
                                    renderValue={selected => selected.join(',')}
                                    value={artists}
                                    onChange={artistSelectHandler}
                                >
                                    {artistsList.map(artist => (
                                        <MenuItem key={artist.id} value={artist.first_name + " " + artist.last_name}>
                                            <Checkbox checked={artists.indexOf(artist.first_name + " " + artist.last_name) > -1} />
                                            <ListItemText primary={artist.first_name + " " + artist.last_name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="releaseDateStart"
                                    label="Release Date Start"
                                    type="date"
                                    defaultValue=""
                                    InputLabelProps={{ shrink: true }}
                                    onChange={releaseDateStartHandler}
                                />
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="releaseDateEnd"
                                    label="Release Date End"
                                    type="date"
                                    defaultValue=""
                                    InputLabelProps={{ shrink: true }}
                                    onChange={releaseDateEndHandler}
                                />
                            </FormControl>
                            <br /><br />
                            <FormControl className={classes.formControl}>
                                <Button onClick={() => filterApplyHandler()} variant="contained" color="primary">
                                    APPLY
                                </Button>
                            </FormControl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}


export default withStyles(styles)(Home);
