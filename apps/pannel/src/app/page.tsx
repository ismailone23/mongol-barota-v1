import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Account from "@/components/account";

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="max-w-[1200px] w-full flex flex-col items-center">
        <h1 className=" text-xl font-medium py-2">
          Mongol Baronta Adming Pannel
        </h1>
        <div className="flex w-full flex-col gap-6">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Verify Account</TabsTrigger>
              <TabsTrigger value="competitions">Competitions</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="rover">Rover</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Account />
            </TabsContent>
            <TabsContent value="competitions">hello</TabsContent>
            <TabsContent value="achievements">hello</TabsContent>
            <TabsContent value="rover">hello</TabsContent>
            <TabsContent value="team">hello</TabsContent>
            <TabsContent value="sponsors">hello</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
