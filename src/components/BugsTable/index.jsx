import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import GetIssue from './issue.graphql';
import BugsTableHead from './BugsTableHead';
import BugsTableEntry from './BugsTableEntry';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});
let BugsTableToolbar = props => {
  const { classes } = props;

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="title" id="tableTitle">
          Bugs
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

BugsTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

BugsTableToolbar = withStyles(toolbarStyles)(BugsTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class BugsTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'desc',
      orderBy: 'lastupdate',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  fetchData(repoList) {
    const { client } = this.props;
    const promises = repoList.map(({ repoName, repoOwner, labels }) =>
      client
        .query({
          query: GetIssue,
          variables: {
            repoName,
            repoOwner,
            labels,
          },
        })
        .catch(
          () =>
            new Promise(resolve => {
              resolve(false);
            })
        )
    );

    Promise.all(promises).then(data => {
      const repoData = data
        .filter(item => item)
        .map(item => item.data.repository.issues.edges);
      const issuesList = repoData.reduce((prev, curr) => {
        const currIssues = curr.map(curr => curr.node);

        return [
          ...prev,
          currIssues.map(issue => {
            const obj = {
              project: this.props.projectName || '-',
              description: `${issue.number} - ${issue.title}`,
              tag: issue.labels.edges.map(label => label.node),
              lastupdate: issue.updatedAt,
              assignedto: issue.assignees.edges[0]
                ? issue.assignees.edges[0].node.login
                : 'None',
            };

            return obj;
          }),
        ];
      }, []);

      this.setState({
        data: []
          .concat(...issuesList)
          .sort((a, b) => (a.lastupdate > b.lastupdate ? -1 : 1)),
      });
    });
  }

  componentDidMount() {
    const { repoList } = this.props;

    this.fetchData(repoList);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Fragment>
        {data.length === 0 ? (
          <div>loading...</div>
        ) : (
          <Paper className={classes.root}>
            <BugsTableToolbar />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <BugsTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => (
                      <BugsTableEntry
                        key={n.id}
                        project={n.project}
                        description={n.description}
                        tag={n.tag}
                        assignedto={n.assignedto}
                        lastupdate={n.lastupdate}
                      />
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Fragment>
    );
  }
}

BugsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BugsTable);
