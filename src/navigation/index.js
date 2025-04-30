import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
import { ROOT } from '../constants'
import { setUserInfo } from '../redux/actions/authActions'
import { setNavigator, useApi } from '../redux/services'
import GuestNavigation from './Guest'
import LoggedNavigation from './Logged'

const navigation = () => {
    const Api = useApi()
    const dispatch = useDispatch()
    const { user } = useSelector((store) => store.auth)

    const GetUserInfo = () => {
        if (user) {
            Api.GetUserInfo(user._id).then(({ data }) => {
                dispatch(setUserInfo(data))
            }).catch(error => {
                console.log(`GetUserInfo`, error)
            })
        }
    }

    useEffect(() => {
        GetUserInfo()
    }, [])

    useEffect(() => {
        if (user) {
            ROOT.Socket = io.connect(ROOT.BACKEND_URL, { query: user })
        }
        return () => {
            if (ROOT.Socket && user) {
                ROOT.Socket.emit('exit', user)
            }
        }
    }, [user])

    if (user) {
        return (
            <LoggedNavigation ref={ref => setNavigator(ref)} />
        )
    } else {
        return <GuestNavigation />
    }
}

export default navigation