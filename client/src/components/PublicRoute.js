import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PublicRoute({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get('https://two5now-api.onrender.com/api/getuser', { withCredentials: true })

            if (res.data.username) {
                navigate('/')
            } else {
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