import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
// react component used to create charts
import ChartistGraph from 'react-chartist';

import Card from 'components/Card/Card.jsx';
import StatsCard from 'components/Card/StatsCard.jsx';

import {
    dataPie,
    dataSales,
    optionsSales,
    responsiveSales,
    table_data
} from 'variables/Variables.jsx';

class Dashboard extends Component{
    createTableData(){
        var tableRows = [];
        for(var i = 0; i < table_data.length; i++){
            tableRows.push(
                <tr key={i}>
                    <td>
                        <div className="flag">
                            <img src={table_data[i].flag} alt="us_flag"/>
                        </div>
                    </td>
                    <td>{table_data[i].country}</td>
                    <td className="text-right">{table_data[i].count}</td>
                    <td className="text-right">{table_data[i].percentage}</td>
                </tr>
            );
        }
        return tableRows;
    }
    render(){
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-server text-warning"></i>}
                                statsText="Capacity"
                                statsValue="105GB"
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-wallet text-success"></i>}
                                statsText="Revenue"
                                statsValue="$1,345"
                                statsIcon={<i className="fa fa-calendar-o"></i>}
                                statsIconText="Last day"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-graph1 text-danger"></i>}
                                statsText="Errors"
                                statsValue="23"
                                statsIcon={<i className="fa fa-clock-o"></i>}
                                statsIconText="In the last hour"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="fa fa-twitter text-info"></i>}
                                statsText="Followers"
                                statsValue="+45"
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Card
                                title="Email Statistics"
                                category="Last Campaign Performance"
                                content={
                                    <ChartistGraph data={dataPie} type="Pie"/>
                                }
                                legend={
                                    <div>
                                        <i className="fa fa-circle text-info"></i> Open
                                        <i className="fa fa-circle text-danger"></i> Bounce
                                        <i className="fa fa-circle text-warning"></i> Unsubscribe
                                    </div>
                                }
                                stats={
                                    <div>
                                        <i className="fa fa-clock-o"></i> Campaign sent 2 days ago
                                    </div>
                                }
                            />
                        </Col>
                        <Col md={8}>
                        <Card
                            title="Users Behavior"
                            category="24 Hours performance"
                            content={
                                <ChartistGraph
                                    data={dataSales}
                                    type="Line"
                                    options={optionsSales}
                                    responsiveOptions={responsiveSales}/>
                                }
                                legend={
                                    <div>
                                        <i className="fa fa-circle text-info"></i> Open
                                        <i className="fa fa-circle text-danger"></i> Click
                                        <i className="fa fa-circle text-warning"></i> Click Second Time
                                    </div>
                                }
                                stats={
                                    <div>
                                        <i className="fa fa-history"></i> Updated 3 minutes ago
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Dashboard;
