import React from 'react';

import styles from './News.module.css';
import Loading from '../Loading/Loading';
import linkIcon from '../../images/link.png';
import { makeStyles } from '@material-ui/core/styles';
import { List, Typography, ListItemText, ListItem, Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    list: {
        maxWidth : '50vw',
        background : '#f0f0f0',
    },
}));
  
const News = ({newsData}) =>{
    const classes = useStyles();
    if(!newsData) return <Loading which="news"/>
    
    return (
        <div className={styles.container}>
            <Typography variant="h3" align="center">News</Typography>
            <List className={styles.list}>
                {newsData.map(data=>(
                    <a className={styles.a} href={data.link} target="_blank">
                        <ListItem className={styles.liItem}>
                            <ListItemText
                            primary={
                                <>
                                {data.title+' '}<img src={linkIcon} width="15" height="15"/>
                                </>}
                            primaryTypographyProps={{component:"li", variant:"body1"}}
                            secondary={
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                    {data.contents}
                                    </Typography>
                            }
                            />
                        </ListItem>
                        <Divider variant="fullWidth" component="li" />
                    </a>
                ))}
            </List>
        </div>
    )
}
export default News
