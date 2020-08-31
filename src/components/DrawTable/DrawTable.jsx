import React, {useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Table, Paper, TableBody, TableCell
        ,TableContainer, TableHead, TableRow} from '@material-ui/core'
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';

import styles from './DrawTable.module.css';

// const StyledTableCell = withStyles((theme) => ({
//     head: {
//       backgroundColor: theme.palette.common.black,
//       color: theme.palette.common.white,
//     },
//     body: {
//       fontSize: 14,
//     },
//   }))(TableCell);
  
// const StyledTableRow = withStyles((theme) => ({
//     root: {
//       '&:nth-of-type(odd)': {
//         backgroundColor: theme.palette.action.hover,
//       },
//     },
//   }))(TableRow);
  
const useStyles = makeStyles({
    tableContainer: {
      maxHeight: '70vh',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
      },
});
const descendingComparator = (a, b, orderBy) =>{
    return b[orderBy] - a[orderBy];
}

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? 
        (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
  
const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


const alignDecision = (c)=>{
    return c ==='region_name' || c === 'rank' ? 'left' :'right'
}


const SortableTableHead = (props) =>{
    const { classes, order, orderBy, onRequestSort, category, columns } = props;
    const createSortHandler = (property) =>(event) =>{
        onRequestSort(event, property);
    };
    const columnDict = {
        'rank' : '순위',
        'region_name' : '지역구',
        'murder' : '살인',
        'robber' : '강도',
        'rape': '강간',
        'theft':'절도',
        'violence' : '폭력',
        'arr_total' : '검거횟수',
        'arrest' : '검거율',
        'household' :'가구수',
        'total_male' : '남(전체)',
        'total_female' : '여(전체)',
        'for_male' : '남(외국인)',
        'for_female' : '여(외국인)',
        'total' : category,
    }
    return (
        <TableHead>
            <TableRow>
                <TableCell key={'rank'} align={'left'}>{'순위'}</TableCell>
                {columns.map(c=>(
                    <TableCell 
                        key = {c} 
                        align={ alignDecision(c) } 
                        sortDirection = {orderBy === c ? order : false}>
                        <TableSortLabel
                            active={orderBy === c}
                            direction={orderBy ===c ? order :'asc'}
                            onClick={createSortHandler(c)}
                        >
                        {columnDict[c] ? columnDict[c] : c }
                        {orderBy === c ? (
                            <span className = {classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                        ):null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

SortableTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
}
const DrawTable = ({regions, category}) => {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('rank');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    var columns = Object.keys(regions[0]); 
    columns.shift();

    const makeNumFomat = (num) =>{
        return <NumberFormat value = {num} thousandSeparator={true} displayType={'text'} />
    }
    return(
        <div>
            <Paper className={styles.container}>
                <TableContainer className={classes.tableContainer}>
                    <Table stickyHeader aria-label="sticky table">
                    <SortableTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        columns ={columns}
                        category ={category}
                        />
                        <TableBody>
                            {stableSort(regions, getComparator(order,orderBy))
                                .map((row,i)=>{ // # of row
                                    return(
                                    <TableRow hover tabIndex={-1} key= {row.region_code}>
                                        <TableCell key={'rank'} align={'left'}>{i+1}</TableCell>
                                        {columns.map((c)=>{ // # of col
                                            let isNum = Number.isInteger(row[c]);
                                            return(
                                            <TableCell key={c} align={alignDecision(c)} >
                                                { isNum ? makeNumFomat(row[c]) : row[c]}
                                            </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
    
}


export default DrawTable;