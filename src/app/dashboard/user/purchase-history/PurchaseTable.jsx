"use client";

import { Avatar, Button, Table, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";

export function PurchaseTable({ data }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending",
  });

  // ডাইনামিক সর্টিং লজিক (image_25ec0d.png এর ফিল্ড অনুযায়ী)
  const sortedItems = useMemo(() => {
    return [...data].sort((a, b) => {
      const col = sortDescriptor.column;
      const first = String(a[col] || "");
      const second = String(b[col] || "");
      
      let cmp = first.localeCompare(second);
      if (sortDescriptor.direction === "descending") cmp *= -1;
      return cmp;
    });
  }, [data, sortDescriptor]);

  return (
    <div className="bg-[#111111]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Purchase History Table"
            className="min-w-[900px]"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting id="title">Artwork</Table.Column>
              <Table.Column allowsSorting id="companyName">Company</Table.Column>
              <Table.Column allowsSorting id="createdAt">Purchase Date</Table.Column>
              <Table.Column allowsSorting id="price">Price</Table.Column>
              <Table.Column id="status">Status</Table.Column>
              <Table.Column className="text-end">Actions</Table.Column>
            </Table.Header>
            
            <Table.Body>
              {sortedItems.map((item) => (
                <Table.Row key={item._id} id={item._id}>
                  {/* আর্টওয়ার্ক ইমেজ ও টাইটেল */}
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="md" className="rounded-xl border border-white/10">
                        <Avatar.Image src={item.image} />
                        <Avatar.Fallback><Icon icon="solar:gallery-bold" /></Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-[#FFE58F]">{item.title}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</span>
                      </div>
                    </div>
                  </Table.Cell>

                  {/* কোম্পানির নাম */}
                  <Table.Cell className="text-gray-300 font-medium">
                    {item.companyName}
                  </Table.Cell>

                  {/* ক্রিয়েট হওয়ার তারিখ */}
                  <Table.Cell className="text-gray-400 text-xs">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Table.Cell>

                  {/* প্রাইস */}
                  <Table.Cell className="font-black text-[#D4AF37]">
                    ${Number(item.price).toLocaleString()}
                  </Table.Cell>

                  {/* পেমেন্ট স্ট্যাটাস */}
                  <Table.Cell>
                    <Chip color="success" size="sm" variant="soft" className="font-bold">
                      Paid
                    </Chip>
                  </Table.Cell>

                  {/* অ্যাকশন বাটনসমূহ */}
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <Button isIconOnly size="sm" variant="ghost" className="border-white/5 hover:bg-white/5 text-gray-400 hover:text-white">
                        <Icon className="size-4" icon="gravity-ui:eye" />
                      </Button>
                      <Button isIconOnly size="sm" variant="ghost" className="border-white/5 hover:bg-white/5 text-gray-400 hover:text-[#D4AF37]">
                        <Icon className="size-4" icon="solar:download-bold" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}