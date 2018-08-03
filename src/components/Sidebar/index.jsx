import { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import { Link, withRouter } from 'react-router-dom';
import WebIcon from 'mdi-react/WebIcon';
import classNames from 'classnames';
import LanguagePythonIcon from 'mdi-react/LanguagePythonIcon';
import LanguageCppIcon from 'mdi-react/LanguageCppIcon';
import LanguageCIcon from 'mdi-react/LanguageCIcon';
import LanguageJavascriptIcon from 'mdi-react/LanguageJavascriptIcon';
import LanguageCsharpIcon from 'mdi-react/LanguageCsharpIcon';
import LanguageCss3Icon from 'mdi-react/LanguageCss3Icon';
import LanguageSwiftIcon from 'mdi-react/LanguageSwiftIcon';
import { BUGZILLA_LANGUAGES } from '../../utils/constants';

@withRouter
@withStyles(theme => ({
  active: {
    '& $text': {
      color: theme.palette.primary.main,
    },
    '& svg': {
      fill: theme.palette.primary.main,
    },
  },
  text: {
    color: theme.palette.grey[800],
    fontFamily: 'Roboto500',
  },
}))
export default class Sidebar extends Component {
  render() {
    const {
      match: {
        params: { language: activeLanguage },
      },
      classes,
    } = this.props;
    const icons = {
      Python: <LanguagePythonIcon />,
      JavaScript: <LanguageJavascriptIcon />,
      Swift: <LanguageSwiftIcon />,
      C: <LanguageCIcon />,
      'C++': <LanguageCppIcon />,
      'C#': <LanguageCsharpIcon />,
      CSS: <LanguageCss3Icon />,
    };

    return (
      <List disablePadding>
        {Object.keys(BUGZILLA_LANGUAGES).map(language => (
          <ListItem
            className={classNames({
              [classes.active]: language.toLowerCase() === activeLanguage,
            })}
            button
            onClick={this.props.onLanguageClick}
            id={language}
            key={language}
            component={Link}
            to={`/languages/${language.toLowerCase()}`}>
            <ListItemIcon>{icons[language] || <WebIcon />}</ListItemIcon>
            <ListItemText disableTypography className={classes.text}>
              {language}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    );
  }
}
