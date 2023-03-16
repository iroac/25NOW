import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function PublicRoute({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await axios.get('/api/getuser', { withCredentials: true })
                navigate('/')
            } catch (err) {
                setUser(true)
            }
        }

        fetchUser()
    })


    return (<div>
        {user && <div>{children}</div>}
    </div>
    )
}

export default PublicRoute