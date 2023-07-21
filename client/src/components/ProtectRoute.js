import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProtectRoute({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/getuser', { withCredentials: true })
                if (res.data.username) {
                    setUser(true)
                } else {
                    navigate('/login')
                }
            } catch (err) {
                navigate('/login')
            }
        }

        fetchUser()
    })


    return (<div>
        {user && <div>{children}</div>}
    </div>
    )
}

export default ProtectRoute