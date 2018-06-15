import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './material-icons/material-icons.css'
import '../src/components/PickTable/PickerTable.css'
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Index from "./containers/index/index";
import Login from "./containers/Login/Login";
import Customer from "./containers/Customer/Customer";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <div className="App">
                {/*<AuthRoute />*/}
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route path='/customerInfo' component={Customer} />
                    <Route path='/sellerInfo' component={Login} />
                    <Route component={Index} />
                </Switch>
            </div>
        </BrowserRouter>
    );
  }
}

export default App;
