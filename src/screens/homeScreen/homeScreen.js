import React, { useEffect } from 'react'
import { Col, Container } from 'react-bootstrap'
import Video from '../../components/video/Video'
import { useDispatch, useSelector } from 'react-redux'
import {
    getPopularVideos,
} from '../../redux/actions/videos.action'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
    getCategorias
} from '../../redux/actions/noticias.action'


import SkeletonVideo from '../../components/skeletons/SkeletonVideo'
import Cards from '../../components/card/Cards'
import uniqid from 'uniqid'

const HomeScreen = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getCategorias())
        dispatch(getPopularVideos())
    }, [dispatch])

    const { categorias, loading: noticiasLoading } = useSelector(
        state => state.noticias
    )


    return (
        <Container>
            {noticiasLoading ?
                <Container className="h-100 d-flex align-items-center justify-content-center"
                    style={{
                        minHeight: "80vh"
                    }}
                >
                    <div className='spinner-border text-danger d-block mx-auto'></div>
                </Container>
                :
                <Cards categorias={categorias} />
            }
        </Container>
    )
}

export default HomeScreen