// "use client";

// import React, { useMemo, useState } from "react";
// import Link from "next/link";
// import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
// import { Icon } from "@iconify/react";

// const statusColorMap = {
//   Approved: "success",
//   Pending: "warning",
//   Rejected: "danger",
//   Draft: "default",
// };

// const initialArtworks = [
//   {
//     id: 1,
//     title: "Golden Hour Symphony",
//     category: "Oil Painting",
//     price: "$450.00",
//     status: "Approved",
//     image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200&auto=format&fit=crop",
//     medium: "Oil on Canvas",
//   },
//   {
//     id: 2,
//     title: "Ethereal Whispers",
//     category: "Acrylic Art",
//     price: "$320.00",
//     status: "Pending",
//     image_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=200&auto=format&fit=crop",
//     medium: "Acrylic on Panel",
//   },
//   {
//     id: 3,
//     title: "Shadows of Truth",
//     category: "Digital Illustration",
//     price: "$600.00",
//     status: "Approved",
//     image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
//     medium: "Digital Canvas",
//   },
//   {
//     id: 4,
//     title: "Dancing Flames",
//     category: "Watercolor Painting",
//     price: "$280.00",
//     status: "Rejected",
//     image_url: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=200&auto=format&fit=crop",
//     medium: "Watercolor on Paper",
//   },
//   {
//     id: 5,
//     title: "Ocean Breeze",
//     category: "Resin Art",
//     price: "$190.00",
//     status: "Draft",
//     image_url: "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=200&auto=format&fit=crop",
//     medium: "Epoxy Resin on Wood",
//   },
// ];

// export default function ArtistAllArts() {
//   const [arts, setArts] = useState(initialArtworks);
//   const [selectedKeys, setSelectedKeys] = useState(new Set());
//   const [sortDescriptor, setSortDescriptor] = useState({
//     column: "title",
//     direction: "ascending",
//   });

//   const sortedArts = useMemo(() => {
//     return [...arts].sort((a, b) => {
//       const col = sortDescriptor.column;
//       const first = String(a[col]);
//       const second = String(b[col]);
//       let cmp = first.localeCompare(second);

//       if (sortDescriptor.direction === "descending") {
//         cmp *= -1;
//       }

//       return cmp;
//     });
//   }, [sortDescriptor, arts]);

//   const handleDelete = (id) => {
//     if (confirm("Are you sure you want to delete this artwork?")) {
//       setArts((prev) => prev.filter((art) => art.id !== id));
//     }
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn">
//       {/* Header section */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="space-y-1">
//           <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-white">
//             My Artworks
//           </h2>
//           <p className="text-sm text-gray-400">
//             View, sort, filter, and manage your custom artwork collection.
//           </p>
//         </div>
//         <Link href="/dashboard/artist/allarts/newArt">
//           <Button
//             radius="xl"
//             className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center gap-2"
//           >
//             <Icon icon="solar:add-circle-bold" className="text-xl" />
//             Post A New Art
//           </Button>
//         </Link>
//       </div>

//       {/* Table Card */}
//       <div className="bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 border border-[#D4AF37]/15 rounded-3xl p-6 shadow-xl relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

//         {arts.length === 0 ? (
//           <div className="text-center py-12 space-y-4">
//             <div className="w-16 h-16 rounded-full bg-gray-850 flex items-center justify-center mx-auto border border-[#D4AF37]/10">
//               <Icon icon="solar:gallery-linear" className="text-[#D4AF37] text-3xl" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-white">No Artworks Listed</h3>
//               <p className="text-sm text-gray-400 mt-1">Get started by uploading your first masterpiece.</p>
//             </div>
//             <Link href="/dashboard/artist/allarts/newArt" className="inline-block mt-2">
//               <Button size="sm" variant="bordered" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10">
//                 Add New Art
//               </Button>
//             </Link>
//           </div>
//         ) : (
//           <Table>
//             <Table.ScrollContainer>
//               <Table.Content
//                 aria-label="Artworks collection table"
//                 className="min-w-[800px]"
//                 selectedKeys={selectedKeys}
//                 selectionMode="multiple"
//                 sortDescriptor={sortDescriptor}
//                 onSelectionChange={setSelectedKeys}
//                 onSortChange={setSortDescriptor}
//               >
//                 <Table.Header>
//                   <Table.Column className="pr-0">
//                     <Checkbox aria-label="Select all" slot="selection">
//                       <Checkbox.Content>
//                         <Checkbox.Control>
//                           <Checkbox.Indicator />
//                         </Checkbox.Control>
//                       </Checkbox.Content>
//                     </Checkbox>
//                   </Table.Column>
//                   <Table.Column allowsSorting id="title">
//                     {({ sortDirection }) => (
//                       <Table.SortableColumnHeader sortDirection={sortDirection}>
//                         Artwork
//                       </Table.SortableColumnHeader>
//                     )}
//                   </Table.Column>
//                   <Table.Column allowsSorting id="medium">
//                     {({ sortDirection }) => (
//                       <Table.SortableColumnHeader sortDirection={sortDirection}>
//                         Medium
//                       </Table.SortableColumnHeader>
//                     )}
//                   </Table.Column>
//                   <Table.Column allowsSorting id="price">
//                     {({ sortDirection }) => (
//                       <Table.SortableColumnHeader sortDirection={sortDirection}>
//                         Price
//                       </Table.SortableColumnHeader>
//                     )}
//                   </Table.Column>
//                   <Table.Column allowsSorting id="status">
//                     {({ sortDirection }) => (
//                       <Table.SortableColumnHeader sortDirection={sortDirection}>
//                         Status
//                       </Table.SortableColumnHeader>
//                     )}
//                   </Table.Column>
//                   <Table.Column className="text-end pr-6">Actions</Table.Column>
//                 </Table.Header>

//                 <Table.Body>
//                   {sortedArts.map((art) => (
//                     <Table.Row key={art.id} id={art.id}>
//                       <Table.Cell className="pr-0">
//                         <Checkbox aria-label={`Select ${art.title}`} slot="selection" variant="secondary">
//                           <Checkbox.Content>
//                             <Checkbox.Control>
//                               <Checkbox.Indicator />
//                             </Checkbox.Control>
//                           </Checkbox.Content>
//                         </Checkbox>
//                       </Table.Cell>
//                       <Table.Cell>
//                         <div className="flex items-center gap-3 py-1">
//                           <Avatar size="md" className="rounded-xl border border-[#D4AF37]/20 shrink-0">
//                             <Avatar.Image src={art.image_url} />
//                             <Avatar.Fallback>
//                               {art.title.slice(0, 2).toUpperCase()}
//                             </Avatar.Fallback>
//                           </Avatar>
//                           <div className="flex flex-col min-w-0">
//                             <span className="text-sm font-bold text-white truncate max-w-xs">{art.title}</span>
//                             <span className="text-xs text-gray-400 truncate">{art.category}</span>
//                           </div>
//                         </div>
//                       </Table.Cell>
//                       <Table.Cell className="text-sm font-medium text-gray-300">
//                         {art.medium}
//                       </Table.Cell>
//                       <Table.Cell className="text-sm font-bold text-[#D4AF37]">
//                         {art.price}
//                       </Table.Cell>
//                       <Table.Cell>
//                         <Chip color={statusColorMap[art.status]} size="sm" variant="soft">
//                           {art.status}
//                         </Chip>
//                       </Table.Cell>
//                       <Table.Cell className="text-end pr-4">
//                         <div className="flex items-center justify-end gap-1">
//                           <Button isIconOnly size="sm" variant="tertiary" className="hover:text-[#D4AF37] text-gray-400 bg-transparent hover:bg-gray-800">
//                             <Icon className="size-4" icon="gravity-ui:eye" />
//                           </Button>
//                           <Button isIconOnly size="sm" variant="tertiary" className="hover:text-[#D4AF37] text-gray-400 bg-transparent hover:bg-gray-800">
//                             <Icon className="size-4" icon="gravity-ui:pencil" />
//                           </Button>
//                           <Button
//                             isIconOnly
//                             size="sm"
//                             variant="danger-soft"
//                             onClick={() => handleDelete(art.id)}
//                             className="text-red-400 hover:text-white bg-transparent hover:bg-red-500/20"
//                           >
//                             <Icon className="size-4" icon="gravity-ui:trash-bin" />
//                           </Button>
//                         </div>
//                       </Table.Cell>
//                     </Table.Row>
//                   ))}
//                 </Table.Body>
//               </Table.Content>
//             </Table.ScrollContainer>
//           </Table>
//         )}
//       </div>
//     </div>
//   );
// }


import React from 'react';

const page = () => {
  return (
    <div>
      all arts
    </div>
  );
};

export default page;