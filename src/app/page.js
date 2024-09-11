"use client";

import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import QueryProvider from "./QueryProvider";
import Image from "next/image";

const fetchImages = async ({ pageParam = 1 }) => {
  const response = await fetch(`http://localhost:4444/images?page=${pageParam}&pageSize=5`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log(`Fetched data for page ${pageParam}:`, data);
  return data;
};

function Home() {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, error } = useInfiniteQuery(
    "images",
    fetchImages,
    {
      getNextPageParam: (lastPage, pages) => {
        // Om det finns fler bilder att hämta
        return lastPage.images.length > 0 ? lastPage.page + 1 : undefined;
      },
    }
  );

  // Kombinera alla sidor till en enda lista
  const allImages = data?.pages?.flatMap((page) => page.images) || [];

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Infinite Scroll Images</h1>
      <InfiniteScroll
        dataLength={allImages.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4>Loading...</h4>}
        scrollThreshold={1}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className='mapWrapper'>
          {allImages.map((image, index) => (
            <div key={index} style={{ margin: "10px" }}>
              <Image
                src={image}
                alt={`Image ${index}`}
                width={350} // Anpassa bredden
                height={0}
                style={{ height: "auto" }}
              />
              {/* <img src={image} alt={`Image ${index}`} style={{ width: "350px", objectFit: "cover" }} /> */}
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {isFetching && !isFetchingNextPage ? <div>Loading...</div> : null}
    </div>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <Home />
    </QueryProvider>
  );
}
