import React from 'react'

export default function Search({handleSearch}) {
  return (
    <>
      <div className="explore_filter position-relative search_tab">
                  <img src="/image/small_search.svg" alt=' ' loading="lazy"/>
                  <input type="text" placeholder="Search here..." onChange={((e)=>handleSearch(e.target.value))} />
                </div>
    </>
  )
}
