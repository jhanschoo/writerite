--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Ubuntu 12.2-4)
-- Dumped by pg_dump version 12.2 (Ubuntu 12.2-4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _occupant; Type: TABLE; Schema: public; Owner: jhanschoo
--

CREATE TABLE public._occupant (
    a uuid NOT NULL,
    b uuid NOT NULL
);


ALTER TABLE public._occupant OWNER TO jhanschoo;

--
-- Name: COLUMN _occupant.a; Type: COMMENT; Schema: public; Owner: jhanschoo
--

COMMENT ON COLUMN public._occupant.a IS 'roomId';


--
-- Name: COLUMN _occupant.b; Type: COMMENT; Schema: public; Owner: jhanschoo
--

COMMENT ON COLUMN public._occupant.b IS 'occupantId';


--
-- Name: _subdeck; Type: TABLE; Schema: public; Owner: jhanschoo
--

CREATE TABLE public._subdeck (
    a uuid NOT NULL,
    b uuid NOT NULL
);


ALTER TABLE public._subdeck OWNER TO jhanschoo;

--
-- Name: COLUMN _subdeck.a; Type: COMMENT; Schema: public; Owner: jhanschoo
--

COMMENT ON COLUMN public._subdeck.a IS 'parentId';


--
-- Name: COLUMN _subdeck.b; Type: COMMENT; Schema: public; Owner: jhanschoo
--

COMMENT ON COLUMN public._subdeck.b IS 'subdeckId';


--
-- Name: card; Type: TABLE; Schema: public; Owner: jhanschoo
--

CREATE TABLE public.card (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    deckid uuid NOT NULL,
    prompt text DEFAULT ''::text NOT NULL,
    fullanswer text DEFAULT ''::text NOT NULL,
    answers text[] DEFAULT '{}'::text[] NOT NULL,
    sortkey text DEFAULT ''::text NOT NULL,
    editedat timestamp without time zone DEFAULT now() NOT NULL,
    template boolean DEFAULT false NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.card OWNER TO jhanschoo;

--
-- Name: chatmsg; Type: TABLE; Schema: public; Owner: jhanschoo
--

CREATE TABLE public.chatmsg (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    roomid uuid NOT NULL,
    senderid uuid,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chatmsg OWNER TO jhanschoo;

--
-- Name: deck; Type: TABLE; Schema: public; Owner: jhanschoo
--

CREATE TABLE public.deck (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    ownerid uuid NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    promptlang text DEFAULT ''::text NOT NULL,
    answerlang text DEFAULT ''::text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.deck OWNER TO jhanschoo;

--
-- Name: room; Type: TABLE; Schema: public; Owner: jhanschoo
--

CREATE TABLE public.room (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    ownerid uuid NOT NULL,
    archived boolean DEFAULT false NOT NULL,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.room OWNER TO jhanschoo;

--
-- Name: user; Type: TABLE; Schema: public; Owner: jhanschoo
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email text NOT NULL,
    passwordhash text,
    googleid text,
    facebookid text,
    name text,
    roles text[] DEFAULT '{}'::text[] NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO jhanschoo;

--
-- Data for Name: _occupant; Type: TABLE DATA; Schema: public; Owner: jhanschoo
--

COPY public._occupant (a, b) FROM stdin;
\.


--
-- Data for Name: _subdeck; Type: TABLE DATA; Schema: public; Owner: jhanschoo
--

COPY public._subdeck (a, b) FROM stdin;
\.


--
-- Data for Name: card; Type: TABLE DATA; Schema: public; Owner: jhanschoo
--

COPY public.card (id, deckid, prompt, fullanswer, answers, sortkey, editedat, template, createdat, updatedat) FROM stdin;
\.


--
-- Data for Name: chatmsg; Type: TABLE DATA; Schema: public; Owner: jhanschoo
--

COPY public.chatmsg (id, roomid, senderid, content, createdat, updatedat) FROM stdin;
\.


--
-- Data for Name: deck; Type: TABLE DATA; Schema: public; Owner: jhanschoo
--

COPY public.deck (id, ownerid, name, description, promptlang, answerlang, published, createdat, updatedat) FROM stdin;
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: jhanschoo
--

COPY public.room (id, ownerid, archived, config, createdat, updatedat) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: jhanschoo
--

COPY public."user" (id, email, passwordhash, googleid, facebookid, name, roles, createdat, updatedat) FROM stdin;
\.


--
-- Name: _occupant _occupant_pkey; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public._occupant
    ADD CONSTRAINT _occupant_pkey PRIMARY KEY (a, b);


--
-- Name: _subdeck _subdeck_pkey; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public._subdeck
    ADD CONSTRAINT _subdeck_pkey PRIMARY KEY (a, b);


--
-- Name: card card_pkey; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);


--
-- Name: chatmsg chatmsg_pkey; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.chatmsg
    ADD CONSTRAINT chatmsg_pkey PRIMARY KEY (id);


--
-- Name: deck deck_pkey; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.deck
    ADD CONSTRAINT deck_pkey PRIMARY KEY (id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_facebookid_key; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_facebookid_key UNIQUE (facebookid);


--
-- Name: user user_googleid_key; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_googleid_key UNIQUE (googleid);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: _occupant_b_idx; Type: INDEX; Schema: public; Owner: jhanschoo
--

CREATE INDEX _occupant_b_idx ON public._occupant USING btree (b);


--
-- Name: _subdeck_b_idx; Type: INDEX; Schema: public; Owner: jhanschoo
--

CREATE INDEX _subdeck_b_idx ON public._subdeck USING btree (b);


--
-- Name: _occupant _occupant_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public._occupant
    ADD CONSTRAINT _occupant_a_fkey FOREIGN KEY (a) REFERENCES public.room(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _occupant _occupant_b_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public._occupant
    ADD CONSTRAINT _occupant_b_fkey FOREIGN KEY (b) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _subdeck _subdeck_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public._subdeck
    ADD CONSTRAINT _subdeck_a_fkey FOREIGN KEY (a) REFERENCES public.deck(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _subdeck _subdeck_b_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public._subdeck
    ADD CONSTRAINT _subdeck_b_fkey FOREIGN KEY (b) REFERENCES public.deck(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: card card_deckid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_deckid_fkey FOREIGN KEY (deckid) REFERENCES public.deck(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chatmsg chatmsg_roomid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.chatmsg
    ADD CONSTRAINT chatmsg_roomid_fkey FOREIGN KEY (roomid) REFERENCES public.room(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chatmsg chatmsg_senderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.chatmsg
    ADD CONSTRAINT chatmsg_senderid_fkey FOREIGN KEY (senderid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: deck deck_ownerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.deck
    ADD CONSTRAINT deck_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: room room_ownerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jhanschoo
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

