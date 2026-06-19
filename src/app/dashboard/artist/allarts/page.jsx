"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCompanyArts } from "@/lib/api/arts";
// Ensure you have your UI components imported here (Button, Table, Icon, Avatar, Checkbox, Chip, etc.)
import { Icon } from "@iconify/react"; 
import { Avatar, Button, Checkbox, Table } from "@heroui/react";

export default function ArtistAllArts() {
  const [arts, setArts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "title",
    direction: "ascending",
  });

  // Fetch data on client side to avoid the 'async client component' error
  useEffect(() => {
    const fetchArts = async () => {
      try {
        const res = await getCompanyArts();
        // Assuming 'res' returns an array of objects directly, or adjust to res.data if nested
        setArts(res || []);
      } catch (error) {
        console.error("Failed to fetch arts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArts();
  }, []);

  const handleDelete = async (id) => {
    // Add your delete logic here
    console.log("Deleting art with id:", id);
  };

  if (isLoading) {
    return <div className="text-white text-center py-10">Loading your arts...</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-white">
            My Artworks
          </h2>
          <p className="text-sm text-gray-400">
            View, sort, filter, and manage your custom artwork collection.
          </p>
        </div>
        <Link href="/dashboard/artist/allarts/newArt">
          <Button
            radius="xl"
            className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center gap-2"
          >
            <Icon icon="solar:add-circle-bold" className="text-xl" />
            Post A New Art
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 border border-[#D4AF37]/15 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

        {/* Empty State Message (as requested) */}
        {arts.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-850 flex items-center justify-center mx-auto border border-[#D4AF37]/10">
              <Icon icon="solar:gallery-linear" className="text-[#D4AF37] text-3xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Artworks Listed</h3>
              <p className="text-sm text-gray-400 mt-1">
                Get started by uploading your first masterpiece.
              </p>
            </div>
            <Link href="/dashboard/artist/allarts/newArt" className="inline-block mt-2">
              <Button size="sm" variant="bordered" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10">
                Add New Art
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Artworks collection table"
                className="min-w-[800px]"
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
              >
                <Table.Header>
                  <Table.Column className="pr-0">
                    <Checkbox aria-label="Select all" slot="selection">
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                  </Table.Column>
                  <Table.Column allowsSorting id="title">
                    Artwork
                  </Table.Column>
                  <Table.Column allowsSorting id="category">
                    Category
                  </Table.Column>
                  <Table.Column allowsSorting id="date">
                    Date
                  </Table.Column>
                  <Table.Column allowsSorting id="price">
                    Price
                  </Table.Column>
                  <Table.Column className="text-end pr-6">
                    Actions
                  </Table.Column>
                </Table.Header>

                <Table.Body>
                  {arts.map((art) => (
                    <Table.Row key={art._id || art.id} id={art._id || art.id}>
                      <Table.Cell className="pr-0">
                        <Checkbox aria-label={`Select ${art.title}`} slot="selection" variant="secondary">
                          <Checkbox.Content>
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox.Content>
                        </Checkbox>
                      </Table.Cell>
                      
                      {/* Image & Title Mapping */}
                      <Table.Cell>
                        <div className="flex items-center gap-3 py-1">
                          <Avatar size="md" className="rounded-xl border border-[#D4AF37]/20 shrink-0">
                            <Avatar.Image src={art.image} alt={art.title || "Artwork"} />
                            <Avatar.Fallback>
                              {(art.title || "AR").slice(0, 2).toUpperCase()}
                            </Avatar.Fallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-white truncate max-w-xs">
                              {art.title || "Untitled"}
                            </span>
                          </div>
                        </div>
                      </Table.Cell>

                      {/* Category Mapping */}
                      <Table.Cell className="text-sm font-medium text-gray-300">
                        {art.category || "N/A"}
                      </Table.Cell>

                      {/* Date Mapping */}
                      <Table.Cell className="text-sm font-medium text-gray-400">
                        {art.date ? new Date(art.date).toLocaleDateString() : "No Date"}
                      </Table.Cell>

                      {/* Price Mapping */}
                      <Table.Cell className="text-sm font-bold text-[#D4AF37]">
                        ${art.price || "0.00"}
                      </Table.Cell>

                      {/* Actions Mapping (Eye, Edit, Delete) */}
                      <Table.Cell className="text-end pr-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Eye (View) */}
                          <Link href={`/dashboard/artist/allarts/${art._id || art.id}`}>
                            <Button isIconOnly size="sm" variant="tertiary" className="hover:text-[#D4AF37] text-gray-400 bg-transparent hover:bg-gray-800">
                              <Icon className="size-4" icon="gravity-ui:eye" />
                            </Button>
                          </Link>
                          
                          {/* Edit */}
                          <Link href={`/dashboard/artist/allarts/edit/${art._id || art.id}`}>
                            <Button isIconOnly size="sm" variant="tertiary" className="hover:text-[#D4AF37] text-gray-400 bg-transparent hover:bg-gray-800">
                              <Icon className="size-4" icon="gravity-ui:pencil" />
                            </Button>
                          </Link>
                          
                          {/* Delete */}
                          <Button
                            isIconOnly
                            size="sm"
                            variant="danger-soft"
                            onClick={() => handleDelete(art._id || art.id)}
                            className="text-red-400 hover:text-white bg-transparent hover:bg-red-500/20"
                          >
                            <Icon className="size-4" icon="gravity-ui:trash-bin" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        )}
      </div>
    </div>
  );
}