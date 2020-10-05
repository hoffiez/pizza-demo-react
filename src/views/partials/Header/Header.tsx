import React from "react";
import { Container, Row, Col } from "reactstrap";
import {UserNavigation} from "../../../ui/UserNavigation/UserNavigation";
import {useHistory} from "react-router";
import {RoutesCreator} from "../../../utils/RoutesCreator";

export const Header = () => {
    const history = useHistory();

    return (
        <header>
            <Container>
                <Row className="justify-content-between">
                    <Col lg={3} className="d-flex align-items-center">
                        <h2 onClick={() => history.push(RoutesCreator.home())}
                            style={{cursor: 'pointer'}}
                        >
                            Dodo Pizza
                        </h2>
                    </Col>
                    <Col lg={4}>
                       <UserNavigation/>
                    </Col>
                </Row>
            </Container>
        </header>
    )
};