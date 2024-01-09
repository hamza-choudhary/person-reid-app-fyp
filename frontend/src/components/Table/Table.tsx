import { useEffect, useState } from 'react'

type ComponentType = {
  Component: React.ElementType
  props: { [key: string]: any }
}

interface TableProps {
  columns: string[]
  data: []
  isActions: boolean
  isLoading: boolean
  noDataMessage: string
  components: ComponentType[]
  idKey: string | undefined
}

const Table: React.FC<TableProps> = ({
  columns = [],
  data = [],
  isActions = false,
  isLoading = false,
  noDataMessage = 'No Data',
  components,
  idKey = undefined,
}) => {
  const [allData, setAllData] = useState(data)

  useEffect(() => {
    setAllData(data)
  }, [data])

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="mt-8 w-full h-[40vh] grid place-items-center">
          Loading....
        </div>
      ) : allData.length === 0 ? (
        <div className="mt-8 w-full h-[40vh] grid place-items-center text-textColor">
          {noDataMessage}
        </div>
      ) : (
        <div className="mt-8 ">
          <div className="-px-4 -my-2 overflow-x-auto sm:-px-6 lg:-px-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table
                className="min-w-full divide-y divide-gray-300 table-fixed equal-cols"
                style={{ '--num-cols': columns.length + 1 }}
              >
                <thead>
                  <tr>
                    {columns.map((colomName, index) => (
                      <th
                        key={`column-${index + Date.now()}`}
                        scope="col"
                        className="py-3.5 text-left text-lg font-semibold text-textColor"
                      >
                        {colomName}
                      </th>
                    ))}

                    {isActions && (
                      <th
                        key={'action'}
                        scope="col"
                        className="py-3.5 text-left text-lg font-semibold text-textColor"
                      >
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allData.map((item, index) => (
                    <TableRow
                      components={components}
                      data={item}
                      idKey={idKey as string}
                      key={`tr-body-${index}-${Date.now()}`}
                      isActions={isActions}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface TableRowProps {
  idKey: string //it should be the mainId on which any action will happen
  data: any
  components: ComponentType[] // Updated type
  isActions: boolean
}

function TableRow({
  data,
  components,
  idKey,
  isActions = false,
}: TableRowProps) {
  // console.log(data)
  const detailedData = data.data

  let id: string
  if (idKey) {
    id = detailedData[idKey]
    // console.log(id)
  }

  const singleValues = []
  for (const key in data) {
    if (key != 'isOpen' && key != 'data') {
      singleValues.push(data[key])
    }
  }

  return (
    <>
      <tr key={`tr-body-${Date.now()}`}>
        {singleValues.map((value, index) => (
          <td className="py-4 px-2" key={`td-body-${index}-${Date.now()}`}>
            {value}
          </td>
        ))}
        {/* //edit or delete components should be mapped here but with some kind of check */}

        {isActions && (
          <td className="py-4 flex justify-start self-center min-w-full">
            {components.map(({ Component, props }, index) => (
              <Component
                id={id}
                data={detailedData}
                key={`comp-${index}}`}
                {...props}
              />
            ))}
          </td>
        )}

        {/* {!isActions && (
          <td className="text-center">
            <button
              className="px-3 py-2 text-white font-semibold rounded-full bg-primary"
              type="button"
              onClick={() => setToggleRow((prev) => !prev)}
            >
              {toggleRow ? 'Close' : 'View Detail'}
            </button>
          </td>
        )} */}
      </tr>
    </>
  )
}

export default Table
