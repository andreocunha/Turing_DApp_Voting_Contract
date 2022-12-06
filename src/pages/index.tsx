import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { ethers, BigNumber } from 'ethers'
import { Forms } from './components/Forms'
import { users } from './mock/users'
import { ButtonLogin } from './components/ButtonLogin'
import { emitAlert } from './utils/alerts'
import { loginMetaMask } from './services/metamask'

export default function Home() {
  const [TuringDappContract, setTuringDappContract] = useState<any>(null)
  const [hasVoted, setHasVoted] = useState([''])
  const [turingValue, setTuringValue] = useState(0)
  const [tokenValue, setTokenValue] = useState(0)

  useEffect(() => {
    // verificar se o usuário já votou em alguem
    const hasVotedLocalStorage = localStorage.getItem('hasVoted')
    if (hasVotedLocalStorage) {
      setHasVoted(JSON.parse(hasVotedLocalStorage))
    }
  }, [])

  function handleVote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const target = event.target;
    // get the value of the input field
    const address = (target as HTMLFormElement).elements[0]
    const addressValue = (address as HTMLInputElement).value

    const amount = (target as HTMLFormElement).elements[1]
    const amountValue = (amount as HTMLInputElement).value

    const user = users.find(user => user.address === addressValue)

    if (user && !hasVoted.includes(user?.address)) {
      // convert the codinome to bytes32
      const codinome = ethers.utils.formatBytes32String(user?.codinome)
      console.log(codinome)
      
      // convert the amount to uint256
      const amount = BigNumber.from(amountValue)
      console.log(amount)
      
      Promise.all([
        TuringDappContract.vote(codinome, amount)
      ]).then(() => {
        console.log('Voto realizado com sucesso')
        emitAlert({
          title: 'Voto realizado com sucesso',
          icon: 'success',
        })

        setHasVoted([...hasVoted, user?.address])
        // salvar o hasVoted no localStorage
        localStorage.setItem('hasVoted', JSON.stringify(hasVoted))

      }).catch((error) => {
        console.log('Erro ao realizar o voto')
        console.log(error?.error?.message)
        emitAlert({
          title: error?.error?.message,
          icon: 'error',
        })
      })
    }

  }

  async function issueToken(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const target = event.target;
    // get the value of the input field
    const address = (target as HTMLFormElement).elements[0]
    const addressValue = (address as HTMLInputElement).value

    const amount = (target as HTMLFormElement).elements[1]
    const amountValue = (amount as HTMLInputElement).value

    Promise.all([
      TuringDappContract.issueToken(addressValue, BigNumber.from(amountValue))
    ]).then(() => {
      console.log('Token emitido com sucesso')
      emitAlert({
        title: 'Token emitido com sucesso',
        icon: 'success',
      })
    }).catch((error) => {
      console.log('Erro ao emitir o token')
      console.log(error?.error?.message)
      emitAlert({
        title: error?.error?.message,
        icon: 'error',
      })
    })
  }

  async function getVotes() {
    // passar o endereço do usuário logado
    const result = await TuringDappContract.getVotes('0xDfb0B8b7530a6444c73bFAda4A2ee3e482dCB1E3')
    console.log(result.toString())
  }

  async function endVoting() {
    Promise.all([
      TuringDappContract.endVoting()
    ]).then(() => {
      console.log('Votação encerrada com sucesso')
      emitAlert({
        title: 'Votação encerrada com sucesso',
        icon: 'success',
      })
    }
    ).catch((error) => {
      console.log('Erro ao encerrar a votação')
      console.log(error?.error?.message)
      emitAlert({
        title: error?.error?.message,
        icon: 'error',
      })
    })
  }

  return (
    <div className='flex h-screen w-screen min-h-full justify-center items-center flex-col'>
      <Head>
        <title>Votação DApp</title>
        <meta name="description" content="Criado por André Cunha" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { TuringDappContract &&
        <h2 className='text-white text-center mb-10'>
          Logado como: <span className='text-green-600'> {TuringDappContract?.signer?._address}</span>
        </h2>
      }

      {
        TuringDappContract ? (
          <Forms title='Votação' onSubmit={handleVote}>
            <span className='text-white text-xs font-semibold'>Escolha um usuário</span>
            <select className='w-full p-2 text-white bg-gray-600 rounded-lg'>
              {users.map(user => (
                <option key={user.address} value={user.address} disabled={hasVoted.includes(user.address)}>
                  {user.codinome}
                </option>
              ))}
            </select>

            <span className='text-white text-xs font-semibold'>Escolha uma quantidade de saTurings</span>
            <input defaultValue={0} 
              className='w-60 p-2 text-white bg-gray-600 rounded-lg'
              type='number' 
              min='0' 
              max={2 * 10**18}               
              onChange={(event) => setTuringValue(Number(event.target.value) / 10**18)}
            />

            <span className='text-white text-xs font-semibold'>Valor total: {turingValue} turings</span>

            <button className='w-full p-2 text-white bg-gray-600 rounded-lg'>Votar</button>
          </Forms>
        )
        :
        (
          <ButtonLogin onSubmit={() => loginMetaMask(setTuringDappContract)} />
        )
      }

      { TuringDappContract?.signer?._address === '0xD07318971e2C15b4f8d3d28A0AEF8F16B9D8EAb6' &&
        <div className='mt-8 w-full flex items-center justify-center'>
          <Forms title='Emissão de tokens' onSubmit={issueToken}>
            <span className='text-white text-xs font-semibold'>Endereço da carteira</span>
            <input className='w-full p-2 text-white bg-gray-600 rounded-lg' type='text' placeholder='Endereco' />

            <span className='text-white text-xs font-semibold'>Quantidade de tokens</span>
            <input className='w-full p-2 text-white bg-gray-600 rounded-lg' type='number' placeholder='Quantidade'
              onChange={(event) => setTokenValue(Number(event.target.value) / 10**18)}
            />

            <span className='text-white text-xs font-semibold'>Valor total: {tokenValue} turings</span>

            <button className='w-full p-2 text-white bg-gray-600 rounded-lg'>Emitir</button>
          </Forms>
        </div>
      }

      { TuringDappContract?.signer?._address === '0xD07318971e2C15b4f8d3d28A0AEF8F16B9D8EAb6' &&
        <button className='w-60 mt-8 p-2 text-white bg-gray-600 rounded-lg hover:bg-gray-400 transition 2s' onClick={endVoting}>Encerrar votação</button>
      }

    </div>
  )
}
