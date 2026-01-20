import { Dropdown, DropdownItem } from "flowbite-react";

const Test = () => {
    return (<>
        dgd gfg df g
        <div className="">

            <Dropdown onSelect={(e) => { console.log(e) }} className="border p-2 bg-red-200" label="Dropdown button" dismissOnClick={false}>
               {/*  <DropdownItem onClick={(e) => console.log(e)}>Dashboard</DropdownItem>
                <DropdownItem onClick={(e) => console.log('Settings')}>Settings</DropdownItem>
                <DropdownItem onClick={(e) => console.log('Earnings')}>Earnings</DropdownItem>
                <DropdownItem onClick={(e) => console.log('Sign out')}>Sign out</DropdownItem> */}
            </Dropdown>

        </div>
    </>

    )
}

export default Test
