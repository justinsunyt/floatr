import React, {useContext} from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'

const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    const {currentUser, userStage} = useContext(AuthContext)

    if (!currentUser) {
        return <Redirect to='/login'/>
    } else if (userStage === 0) {
        if (rest.path === "/settings") {
            return (
                <Route
                    {...rest}
                    render={routeProps => <RouteComponent {...routeProps} />}
                />
            )
        } else {
            return <Redirect to='/settings'/>
        }
    } else {
        return (
            <Route
                {...rest}
                render={routeProps => <RouteComponent {...routeProps} />}
            />
        )
    }
}

export default PrivateRoute