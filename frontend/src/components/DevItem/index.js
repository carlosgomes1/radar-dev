import React from 'react'
import { FiTrash2 } from 'react-icons/fi'

import api from '../../Services/api'

import './styles.css'

function DevItem({ dev }) {
  const github_username = dev.github_username

  async function handleDelete() {
    await api.delete(`/delete?github_username=${ github_username }`)
  }

    return(
        <li className="dev-item">
            <header>
              <img src={ dev.avatar_url } alt={ dev.name } />

              <div className="user-info-trash">
                <div className="user-info">
                  <strong> { dev.name } </strong>
                  <span> { dev.techs.join(', ') } </span>
                </div>
                <button onClick={ handleDelete }> <FiTrash2 size={ 20 } /> </button>
              </div>

            </header>
            <p>
              { dev.bio } 
            </p>
            <a href={ `https://github.com/${ dev.github_username }` }> Acessar perfil no Github </a>
          </li>
    )
}

export default DevItem