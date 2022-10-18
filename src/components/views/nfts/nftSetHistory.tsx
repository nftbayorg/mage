import { NFTSetHistory } from "prisma/prisma-client"
import { MdSwapHoriz } from "react-icons/md"
import { CollapsePanel } from "../../forms/controls/CollapsePanel"
import { Column, Row, Table, TableHeader } from "../../forms/controls/Table"

type NftSetHistoryProps = {
  history: NFTSetHistory[]
}

export const NftSetHistory = ({ history }: NftSetHistoryProps) => {
  
  return (
    <CollapsePanel
      label="Item Activity"
      classesOverride="p-0 md:p-0"
      icon={<MdSwapHoriz size={30} className="fill-gray-700 dark:fill-gray-400 rotate-90"/>}
    >
      <Table>
        <TableHeader>
          <Column><div>Event Type</div></Column>
          <Column><div>Price</div></Column>
          <Column><div>From</div></Column>
          <Column><div>To</div></Column>
          <Column><div>Date</div></Column>
        </TableHeader>
        <>
          {history.map(eventItem => (
            <Row key={eventItem.id}>
              <Column><div className="w-full">{eventItem.eventType}</div></Column>
              <Column><div>{eventItem.price.toString()}</div></Column>
              <Column><div>{eventItem.fromAdminWallet ? "Mage" : eventItem.walletFromId}</div></Column>
              <Column><div>{eventItem.walletToId}</div></Column>
              <Column><div>{eventItem.createdAt.toLocaleDateString()}</div></Column>
            </Row>
          ))}
        </>
      </Table>
    </CollapsePanel>
  )
}
