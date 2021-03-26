import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import {GoogleForm} from "../imports/ui/GoogleLoginForm";

Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'));
  render(<GoogleForm/>, document.getElementById('google-login-form'))
});
