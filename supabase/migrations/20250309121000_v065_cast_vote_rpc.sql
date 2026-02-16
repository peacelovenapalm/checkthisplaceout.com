-- v0.65 voting RPC (no triggers)

create or replace function public.cast_vote(
  p_place_id uuid,
  p_vote text
)
returns table (
  yes_count integer,
  no_count integer,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  is_member boolean;
  current_status text;
begin
  if p_vote not in ('yes', 'no') then
    raise exception 'Invalid vote.';
  end if;

  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_active = true
      and role in ('admin', 'bartender')
  ) into is_member;

  if not is_member then
    raise exception 'Not allowed.';
  end if;

  select status into current_status
  from public.places
  where id = p_place_id;

  if current_status is null then
    raise exception 'Place not found.';
  end if;

  if current_status <> 'submitted' then
    raise exception 'Not ready for voting.';
  end if;

  begin
    insert into public.votes (place_id, voter_id, vote)
    values (p_place_id, auth.uid(), p_vote);
  exception when unique_violation then
    raise exception 'You already voted.';
  end;

  select count(*) into yes_count
  from public.votes
  where place_id = p_place_id
    and vote = 'yes';

  select count(*) into no_count
  from public.votes
  where place_id = p_place_id
    and vote = 'no';

  status := current_status;

  if yes_count >= 3 and yes_count > no_count then
    update public.places
    set status = 'approved',
        approved_at = now()
    where id = p_place_id
      and status = 'submitted';
    status := 'approved';
  end if;

  return query select yes_count, no_count, status;
end;
$$;

revoke all on function public.cast_vote(uuid, text) from public;
grant execute on function public.cast_vote(uuid, text) to authenticated;
grant execute on function public.cast_vote(uuid, text) to service_role;
