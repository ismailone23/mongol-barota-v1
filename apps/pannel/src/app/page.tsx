"use client";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Account from "@/components/account";
import Team from "@/components/teams/team";
import Rover from "@/components/rover";
import Competition from "@/components/competitions";
import Sponser from "@/components/sponsers";
import Plan from "@/components/plan";
// import { useSession } from "next-auth/react";
// import { useTRPC } from "@/trpc/react";
// import { useQuery } from "@tanstack/react-query";
// import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
// import { ForceSignOut } from "@/components/auth/force-signout";

export default function Page() {
  // const session = useSession();
  // const trpc = useTRPC();

  // const { data, isLoading } = useQuery(
  //   trpc.auth.isActualUser.queryOptions({ email: session.data?.user.email })
  // );
  // if (isLoading) {
  //   return (
  //     <div className="w-full h-full items-center justify-center">
  //       <LoadingSpinner className="w-16 h-16" />
  //     </div>
  //   );
  // }
  // if (data) {
  //   if (data.isUser) {
  //     return <ForceSignOut />;
  //   }
  // }
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
              <TabsTrigger value="rover">Rover</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              <TabsTrigger value="plan">Plans</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Account />
            </TabsContent>
            <TabsContent value="competitions">
              <Competition />
            </TabsContent>
            <TabsContent value="rover">
              <Rover />
            </TabsContent>
            <TabsContent value="team">
              <Team />
            </TabsContent>
            <TabsContent value="sponsors">
              <Sponser />
            </TabsContent>
            <TabsContent value="plan">
              <Plan />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
