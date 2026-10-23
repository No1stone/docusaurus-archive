---
format: md
id: k-union-all
title: "Union All"
description: "Union All"
tags:
  - notes
status: active
slug: /knowledge/k-union-all
---
# Union All

```sql
CREATE OR REPLACE VIEW view_partner_studio_uinon
 AS
 SELECT 'studio'::text AS type,
    aa.profile_id,
    aa.studio_id AS mapping_profile_id,
    aa.studio_name AS name,
    'studio'::text AS company_type,
    aa.business_location_cd AS location_cd,
    ( SELECT tb_admin_country_code.country
           FROM tb_admin_country_code
          WHERE tb_admin_country_code.country_cd = aa.business_location_cd) AS location_cd_name,
    aa.post_cd,
    aa.region,
    aa.city,
    aa.addr1,
    aa.addr2,
    aa.mod_dt
   FROM tb_profile_company_studio aa
UNION ALL
 SELECT 'partner'::text AS type,
    bb.profile_id,
    bb.partner_id AS mapping_profile_id,
    dd.company_name AS name,
    ( SELECT string_agg(gg.val::text, ','::text) AS string_agg
           FROM tb_account_company_type ff
             LEFT JOIN tb_admin_common_detail_code gg ON ff.company_cd::text = gg.dcode::text AND ff.company_cd::text <> 'COP000000'::text
          WHERE ff.accnt_id = cc.accnt_id) AS company_type,
    ee.location_cd,
    ( SELECT tb_admin_country_code.country
           FROM tb_admin_country_code
          WHERE tb_admin_country_code.country_cd = ee.location_cd::bpchar) AS location_cd_name,
    dd.post_cd,
    dd.region,
    dd.city,
    dd.addr1,
    dd.addr2,
    bb.mod_dt
   FROM tb_profile_company_partner bb
     LEFT JOIN tb_profile_company cc ON bb.partner_id = cc.profile_id
     LEFT JOIN tb_account_company_detail dd ON cc.accnt_id = dd.accnt_id
     LEFT JOIN tb_account_company_location ee ON cc.accnt_id = ee.accnt_id;

```

```sql
-- View: sparwk01.view_user_info

-- DROP VIEW sparwk01.view_user_info;

CREATE OR REPLACE VIEW sparwk01.view_user_info
 AS
 SELECT pp.profile_id,
    pp.full_name,
    pp.bio,
    pp.headline,
    pp.current_city_country_cd,
    pp.current_city_nm,
    pp.profile_img_url,
    aa.phone_number,
    ( SELECT string_agg(pl.language_cd::text, ','::text) AS string_agg
           FROM tb_profile_language pl
          WHERE pl.profile_id = pp.profile_id) AS language,
    pp.mattermost_id,
    aa.accnt_email,
    ( SELECT (((
                CASE
                    WHEN (EXISTS ( SELECT tpp_1.artist_yn
                       FROM tb_profile_position tpp_1
                      WHERE tpp_1.profile_id = pp.profile_id AND tpp_1.artist_yn = 'Y'::bpchar)) THEN 'artist'::character varying::text
                    ELSE ''::text
                END || ','::text) ||
                CASE
                    WHEN (EXISTS ( SELECT tpp_1.anr_yn
                       FROM tb_profile_position tpp_1
                      WHERE tpp_1.profile_id = pp.profile_id AND tpp_1.anr_yn = 'Y'::bpchar)) THEN 'anr'::character varying::text
                    ELSE ''::text
                END) || ','::text) ||
                CASE
                    WHEN (EXISTS ( SELECT tpp_1.creator_yn
                       FROM tb_profile_position tpp_1
                      WHERE tpp_1.profile_id = pp.profile_id AND tpp_1.creator_yn = 'Y'::bpchar)) THEN 'creator'::character varying::text
                    ELSE ''::text
                END) AS permision_type,
    pp.verify_yn AS profile_verify_yn
   FROM tb_profile pp
     LEFT JOIN tb_account aa ON pp.accnt_id = aa.accnt_id;

ALTER TABLE sparwk01.view_user_info
    OWNER TO sparwk_usr01;
```

```sql
-- View: sparwk01.view_connect_list

-- DROP VIEW sparwk01.view_connect_list;

CREATE OR REPLACE VIEW sparwk01.view_connect_list
 AS
 SELECT 'user'::text AS profile_type,
    up.profile_id,
    up.profile_img_url AS profile_img,
    up.full_name AS profile_name,
    'user'::text AS website,
    up.current_city_country_cd AS location_cd,
    up.current_city_nm AS city,
    ua.accnt_email AS email,
    ua.phone_number,
    up.mod_dt
   FROM tb_profile up
     LEFT JOIN tb_account ua ON up.accnt_id = ua.accnt_id
     LEFT JOIN tb_account_passport ap ON up.accnt_id = ap.accnt_id
UNION ALL
 SELECT 'company'::text AS profile_type,
    cp.profile_id,
    cp.profile_img_url AS profile_img,
    cad.company_name AS profile_name,
    cp.com_info_website AS website,
    cal.location_cd,
    cad.city,
    ca.accnt_email AS email,
    'company'::text AS phone_number,
    cp.mod_dt
   FROM tb_profile_company cp
     LEFT JOIN tb_account ca ON cp.accnt_id = ca.accnt_id
     LEFT JOIN tb_account_company_detail cad ON cp.accnt_id = cad.accnt_id
     LEFT JOIN tb_account_company_location cal ON cp.accnt_id = cal.accnt_id
UNION ALL
 SELECT 'group'::text AS profile_type,
    pg.profile_id,
    pg.profile_img_url AS profile_img,
    pg.profile_group_name AS profile_name,
    pg.web_site AS website,
    agd.location_cd,
    agd.city,
    ga.accnt_email AS email,
    pgc.contct_phone_number AS phone_number,
    pg.mod_dt
   FROM tb_profile_group pg
     LEFT JOIN tb_account ga ON pg.accnt_id = ga.accnt_id
     LEFT JOIN tb_account_group_detail agd ON pg.accnt_id = agd.accnt_id
     LEFT JOIN tb_profile_group_contact pgc ON pg.profile_id = pgc.profile_id;

ALTER TABLE sparwk01.view_connect_list
    OWNER TO sparwk_usr01;
```

```sql
-- View: sparwk01.view_company_info

-- DROP VIEW sparwk01.view_company_info;

CREATE OR REPLACE VIEW sparwk01.view_company_info
 AS
 SELECT pc.profile_id,
    pc.profile_company_name,
    pc.headline,
    acl.location_cd,
    acd.region,
    acd.city,
    pc.profile_img_url,
    pc.com_info_website AS web_site,
    pc.mattermost_id,
    aa.accnt_email,
    ( SELECT string_agg(acta.company_cd::text, ','::text) AS string_agg
           FROM tb_account_company_type acta
             LEFT JOIN tb_account_company_type act ON pc.accnt_id = act.accnt_id
          WHERE acta.accnt_id = pc.accnt_id AND acta.company_license_verify_yn = 'Y'::bpchar) AS permision_type,
    ( SELECT
                CASE
                    WHEN tact.company_license_verify_yn = 'Y'::bpchar THEN 'Y'::text
                    ELSE 'N'::text
                END AS "case"
           FROM tb_account_company_type tact
          WHERE tact.accnt_id = aa.accnt_id
          GROUP BY tact.company_license_verify_yn) AS profile_verify_yn
   FROM tb_profile_company pc
     LEFT JOIN tb_account aa ON pc.accnt_id = aa.accnt_id
     LEFT JOIN tb_account_company_detail acd ON pc.accnt_id = acd.accnt_id
     LEFT JOIN tb_account_company_location acl ON pc.accnt_id = acl.accnt_id;

ALTER TABLE sparwk01.view_company_info
    OWNER TO sparwk_usr01;

GRANT ALL ON TABLE sparwk01.view_company_info TO sparwk_usr02;
GRANT ALL ON TABLE sparwk01.view_company_info TO sparwk_usr01;
```

```sql
-- View: sparwk01.view_group_info

-- DROP VIEW sparwk01.view_group_info;

CREATE OR REPLACE VIEW sparwk01.view_group_info
 AS
 SELECT pc.profile_id,
    pc.profile_group_name,
    pc.headline,
    agd.location_cd,
    agd.region,
    agd.city,
    pc.profile_img_url,
    pc.web_site,
    pc.mattermost_id,
    aa.accnt_email,
    ( SELECT string_agg(agta.group_cd::text, ','::text) AS string_agg
           FROM tb_account_group_type agta
             LEFT JOIN tb_account_group_type agt ON pc.accnt_id = agt.accnt_id
          WHERE agta.accnt_id = pc.accnt_id AND agta.group_license_varify_yn = 'Y'::bpchar) AS permision_type,
    ( SELECT
                CASE
                    WHEN tact.group_license_varify_yn = 'Y'::bpchar THEN 'Y'::text
                    ELSE 'N'::text
                END AS "case"
           FROM tb_account_group_type tact
          WHERE tact.accnt_id = aa.accnt_id AND tact.group_license_varify_yn = 'Y'::bpchar
          GROUP BY tact.group_license_varify_yn) AS profile_verify_yn
   FROM tb_profile_group pc
     LEFT JOIN tb_account aa ON pc.accnt_id = aa.accnt_id
     LEFT JOIN tb_account_group_detail agd ON pc.accnt_id = agd.accnt_id;

ALTER TABLE sparwk01.view_group_info
    OWNER TO sparwk_usr01;

GRANT ALL ON TABLE sparwk01.view_group_info TO sparwk_usr02;
GRANT ALL ON TABLE sparwk01.view_group_info TO sparwk_usr01;
```
