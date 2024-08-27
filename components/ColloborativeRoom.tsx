"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import React, { ReactNode } from "react";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveColloborators from "./ActiveColloborators";
import Loader from "./Loader";

const ColloborativeRoom = ({roomId,roomMetadata}:CollaborativeRoomProps) => {
  console.log(roomMetadata)
  return (
    <div>
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader/>}>
          <div className="collaborative-room">
          <Header>
            <div className="flex w-fit items-center justify-center gap-2">
              <p className="document-title">Share</p>
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveColloborators/>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            </div>
          </Header>
          <Editor />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </div>
  );
};

export default ColloborativeRoom;
