"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveColloborators from "./ActiveColloborators";
import Loader from "./Loader";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/lib/actions/room.actions";

const ColloborativeRoom = ({
  roomId,
  roomMetadata,
}: CollaborativeRoomProps) => {
  const currentUserType = "editor";
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        if (documentTitle !== roomMetadata.title) {
          const updateDocs = await updateDocument(roomId, documentTitle);
          if (updateDocs) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        console.log(documentTitle);
        updateDocument(roomId, documentTitle);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div>
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          <div className="collaborative-room">
            <Header>
              <div
                ref={containerRef}
                className="flex w-fit items-center justify-center gap-2"
              >
                {editing && !loading ? (
                  <Input
                    type="text"
                    value={documentTitle}
                    placeholder="Enter title"
                    // ref={inputRef}s
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onKeyDown={updateTitleHandler}
                    disabled={!editing}
                    className="document-title-input"
                  />
                ) : (
                  <p>{documentTitle}</p>
                )}
                {currentUserType === "editor" && !editing && (
                  <Image
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                    className="pointer"
                    onClick={() => setEditing(true)}
                  />
                )}
                {currentUserType !== "editor" && !editing && (
                  <p className="view-only-tag">View Only</p>
                )}
                {loading && <p className="text-sm text-gray-400">saving...</p>}
              </div>
              <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                <ActiveColloborators />
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
