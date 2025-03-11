import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdsList from '../AdsList/AdsList'
import Loading from '../Loading/Loading'
import { useQuery } from '@apollo/client'
import { GET_ALL_ADS_IN_A_CATEGORY } from '../../GraphQL/categories'

const CategoryDetail = () => {
  const [itemsOnPage, setItemsOnPage] = useState(15)
  const [pageIndex, setPageIndex] = useState(1)
  const [maxPage, setMaxPage] = useState<number>()
  const params = useParams<{ id: string }>()

  const { data, loading, error } = useQuery(
    GET_ALL_ADS_IN_A_CATEGORY,
    {
      variables: { param: params.id },
    },
  )
  const category = data?.getCategoryById.category
  const ads = data?.getCategoryById.ads

  useEffect(() => {
    if (data?.getCategoryById.pagination.totalPages) {
      setMaxPage(data.getCategoryById.pagination.totalPages)
    }
  }, [data])

  if (error) {
    console.log(error)
    return <div>Impossible de charger les annonces.</div>
  }

  return loading ? (
    <Loading />
  ) : (
    maxPage && category && (
      <AdsList
        title={category.name}
        items={ads}
        itemsOnPage={itemsOnPage}
        setItemsOnPage={setItemsOnPage}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        maxPage={maxPage}
      />
    )
  )
}

export default CategoryDetail
