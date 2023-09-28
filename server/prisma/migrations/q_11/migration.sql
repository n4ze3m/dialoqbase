-- New Hybrid Search Query
create or replace function kw_match_documents(query_text text, bot_id text, match_count int)
returns table (id int, content text, metadata jsonb, similarity real)
as $$
begin
    return query execute
    format('select bt.id, bt.content, bt.metadata, ts_rank(to_tsvector(bt.content), plainto_tsquery($1)) as similarity
    from "BotDocument" AS bt
    where to_tsvector(bt.content) @@ plainto_tsquery($1) and bt."botId" = $2::text
    order by similarity desc
    limit $3')
    using query_text, bot_id, match_count;
end;
$$ language plpgsql;
-- New Search Query
CREATE OR REPLACE FUNCTION similarity_search_v2 (
  query_embedding vector,
  botId text,
  match_count int DEFAULT null
) RETURNS TABLE (
  id int,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bt.id,
    bt.content,
    bt.metadata,
    1 - (bt.embedding <=> query_embedding) AS similarity
  FROM "BotDocument" AS bt
  WHERE bt."botId" = similarity_search_v2.botId -- Check botId
  ORDER BY bt.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN "use_hybrid_search" BOOLEAN NOT NULL DEFAULT false;
