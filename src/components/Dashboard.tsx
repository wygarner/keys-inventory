import React, { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import { useAuth } from "../context/authContext"
import { useHistory } from "react-router-dom"
import firebase from '../firebase';
import { useTable } from 'react-table'
import styled from 'styled-components';
import { BodyComponent, FooterComponent } from '../styles/styles'
import  Navigation from './Navigation'


const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data } : any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows
  } = useTable({
    columns, data
  })
  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser , logout } : any = useAuth()
  const [itemList, setItemList] = useState<any>()
  const history = useHistory()

  useEffect(() => {
    const itemRef = firebase.database().ref('Properties')
    itemRef.on("value", (snapshot) => {
      const items = snapshot.val()
      const list : any = [];
      for (let id in items) {
        list.push(items[id])
      }
      setItemList(list)
    });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Address',
        accessor: 'Address', // accessor is the "key" in the data
      },
      {
        Header: 'Location',
        accessor: 'Location',
      },
      {
        Header: 'Status',
        accessor: 'Status',
      },
      {
        Header: 'Return',
        accessor: 'Return',
        Cell: ({
          value: initialValue,
          row: { index },
          column: { id }
        } : any) => {
          // We need to keep and update the state of the cell normally
          const [value, setValue] = useState(initialValue)
        
          const onChange = (e: { target: { value: any; }; }) => {
            setValue(e.target.value)
          }
        
          const updateMyData = (rowIndex : any, columnId : any, value : any) => {
            const itemRef = firebase.database().ref('Properties').child(rowIndex)
            itemRef.update({
              Return : value,
              Status : "Out",
              Employee : currentUser.email
            })
            itemRef.on("value", (snapshot) => {
              const item = snapshot.val()
              const keyRef = firebase.database().ref('Current')
              var today = new Date();
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0');
              var yyyy = today.getFullYear();
              var date = yyyy + '-' + mm + '-' + dd;
              const key = {
                Address : item.Address,
                Location : item.Location,
                Out : date,
                Return : item.Return,
                Employee : item.Employee,
                Complete : false
              }
              console.log(key)
              keyRef.push(key)
            });
          }
        
          // We'll only update the external data when the input is blurred
          const onBlur = () => {
            updateMyData(index, id, value)
          }
        
          // If the initialValue is changed external, sync it up with our state
          React.useEffect(() => {
            setValue(initialValue)
          }, [initialValue])
        
          return <input type="date" value={value} onChange={onChange} onBlur={onBlur} />
        }
      },
      {
        Header: 'Employee',
        accessor: 'Employee',
      },
    ],
    [currentUser]
  )

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  if (typeof(itemList) !== 'undefined') {
    return (
      <>
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <BodyComponent> 
            <Navigation />
            <Styles>
              <Table columns={columns} data={itemList} />
            </Styles>
          </BodyComponent>
          <FooterComponent>
            <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
              Log Out
            </Button>
            </div>
          </FooterComponent>
        </div>
      </>
    )
  } else {
    return (
      <></>
    )
  }
}